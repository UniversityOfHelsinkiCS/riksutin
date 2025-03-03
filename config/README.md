## How to configure?

`config/index.ts`: Requires a `export default` type of `Partial<InstanceExports>`.

`config/services/*`: Require the implementation to export either the defined functions or a nullish value.

`config/services/organisations`: `getOrganisationData` and `getUserOrganisationData` are required to define async void functions or nullish values.

`config/services/authentication`: Requires a default export defined as an async void function or nullish value. In the current configuration this sets up a passport middleware.

`config/services/mailer`: Requires a defalut export defined as an async void function or nullish value.
