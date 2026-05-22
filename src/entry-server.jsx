import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'

export { STAGE_1_ROUTES, getRouteHead } from './App.jsx'

export function render(url, data) {
  return renderToString(
    <StaticRouter location={url}>
      <App initialData={data} />
    </StaticRouter>
  )
}
