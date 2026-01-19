import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { PUBLIC_URL } from '@config'

import App from './App'
import InteractiveForm from './components/InteractiveForm/InteractiveForm'
import EditEntry from './components/InteractiveForm/EditEntry'
import UserPage from './components/UserPage/UserPage'
import UserEntry from './components/UserPage/UserEntry'
import Admin from './components/Admin/Admin'
import EditQuestions from './components/Admin/EditQuestions/EditQuestions'
import RenderEditQuestions from './components/Admin/EditQuestions/RenderEditQuestions'
import RenderEditSurvey from './components/Admin/EditSurvey/RenderEditSurvey'
import Summary from './components/Admin/Summary/Summary'
import AdminDebugView from './components/Admin/DebugView'
import RootBoundary from './components/Errors/RootBoundary'
import NotFound from './components/Errors/NotFound'

import RenderEditResults from './components/Admin/EditResults/RenderEditResults'
import EditResults from './components/Admin/EditResults/EditResults'

import RenderMainWarningsPage from './components/Admin/Warnings'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <RootBoundary />,
      children: [
        {
          index: true,
          element: <InteractiveForm />,
          errorElement: <RootBoundary />,
        },
        {
          path: '/user',
          element: <UserPage />,
          errorElement: <RootBoundary />,
        },
        {
          path: '/user/:entryId',
          element: <UserEntry />,
          errorElement: <RootBoundary />,
        },
        {
          path: '/user/:entryId/edit',
          element: <EditEntry />,
          errorElement: <RootBoundary />,
        },

        {
          path: '/admin/debug',
          element: <AdminDebugView />,
        },
        {
          path: '/admin',
          element: <Admin />,
          errorElement: <RootBoundary />,
          children: [
            {
              path: 'summary',
              element: <Summary />,
            },
            {
              path: 'entry/:entryId',
              element: <UserEntry />,
            },
            {
              path: 'edit-survey',
              element: <RenderEditSurvey />,
            },
            {
              path: 'edit-questions',
              element: <RenderEditQuestions />,
              children: [
                {
                  path: ':questionId',
                  element: <EditQuestions />,
                },
              ],
            },
            {
              path: 'edit-results',
              element: <RenderEditResults />,
              children: [
                {
                  path: ':resultId',
                  element: <EditResults />,
                },
              ],
            },
            {
              path: 'warnings',
              element: <RenderMainWarningsPage />,
            },
          ],
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: PUBLIC_URL,
  }
)

const Router = () => <RouterProvider router={router} />

export default Router
