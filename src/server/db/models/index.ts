import Survey from './Survey'
import Question from './Question'
import Result from './Result'
import User from './User'
import Entry from './Entry'
import Cache from './Cache'

import Warning from './Warning'

Question.belongsTo(Survey)
Survey.hasMany(Question)

Result.belongsTo(Survey)
Survey.hasMany(Result)

Entry.belongsTo(Survey)
Survey.hasMany(Result)
Entry.belongsTo(User)
User.hasMany(Entry)

//Warning.hasMany(Warning)

export { Survey, Question, Result, User, Entry, Warning, Cache }
