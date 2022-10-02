import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLongArrowAltDown,
  faFileCode,
  faCodeBranch,
  faBug,
  faCrown,
} from '@fortawesome/free-solid-svg-icons'
import {
  faGithubAlt,
  faStackOverflow,
  faGithub,
} from '@fortawesome/free-brands-svg-icons'

import icon from './icons.vue'

library.add(
  faGithubAlt,
  faStackOverflow,
  faLongArrowAltDown,
  faFileCode,
  faBug,
  faCodeBranch,
  faGithub,
  faCrown
)

export default icon
