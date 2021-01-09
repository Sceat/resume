import { library } from "@fortawesome/fontawesome-svg-core"
import { faLongArrowAltDown, faFileCode, faCodeBranch, faBug } from "@fortawesome/free-solid-svg-icons"
import { faGithubAlt, faStackOverflow } from "@fortawesome/free-brands-svg-icons"
import icon from "./icons.vue"

library.add(faGithubAlt, faStackOverflow, faLongArrowAltDown, faFileCode, faBug, faCodeBranch)

export default icon