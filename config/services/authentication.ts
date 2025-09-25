import { Issuer, Strategy, TokenSet, UnknownObject, UserinfoResponse } from 'openid-client'
import passport from 'passport'

import { inE2EMode, inDevelopment, inAcualStaging } from '@config'
import { OIDC_ISSUER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_REDIRECT_URI } from '@userconfig'
import type { User as UserType } from '@types'
import type { UserInfo } from '@server/types'
import { User } from '@dbmodels'

const params = {
  claims: {
    id_token: {
      uid: { essential: true },
      hyPersonSisuId: { essential: true },
    },
    userinfo: {
      email: { essential: true },
      hyGroupCn: { essential: true },
      preferredLanguage: null,
      given_name: null,
      family_name: null,
    },
  },
}

const checkAdmin = (iamGroups: string[]) => iamGroups.some(iamGroup => ['grp-toska', 'grp-risk-i'].includes(iamGroup))

const getClient = async () => {
  const issuer = await Issuer.discover(OIDC_ISSUER)

  const client = new issuer.Client({
    client_id: OIDC_CLIENT_ID,
    client_secret: OIDC_CLIENT_SECRET,
    redirect_uris: [OIDC_REDIRECT_URI],
    response_types: ['code'],
  })

  return client
}

const verifyLogin = async (
  _tokenSet: TokenSet,
  userinfo: UserinfoResponse<UnknownObject, UnknownObject>,
  done: (err: any, user?: unknown) => void
) => {
  const {
    uid,
    hyPersonSisuId,
    email,
    hyGroupCn: iamGroups,
    preferredLanguage: language,
    given_name: firstName,
    family_name: lastName,
  } = userinfo as unknown as UserInfo

  const user: UserType = {
    id: uid,
    username: hyPersonSisuId || uid,
    firstName,
    lastName,
    email,
    iamGroups,
    language,
    isAdmin: checkAdmin(iamGroups),
  }

  await User.upsert({
    ...user,
    lastLoggedIn: new Date(),
  })

  done(null, user)
}

const setupAuthentication = async () => {
  if (inE2EMode || inDevelopment || inAcualStaging) {
    return
  }

  const client = await getClient()

  passport.serializeUser((user, done) => {
    const { id, iamGroups, isAdmin } = user as UserType

    return done(null, { id, iamGroups, isAdmin })
  })

  passport.deserializeUser(async ({ id, iamGroups }: { id: string; iamGroups: string[] }, done) => {
    const user = await User.findByPk(id)

    if (!user) {
      return done(new Error('User not found'))
    }

    return done(null, { ...user.dataValues, iamGroups })
  })

  passport.use('oidc', new Strategy({ client, params }, verifyLogin))
}

export default setupAuthentication
