import UtilsFormatted from './formatted/index.js'
import UtilsValidation from './validation/index.js'
import UtilsBuild from './build/index.js'

import * as Parse from './parse.js'

export default {
    Formatted: UtilsFormatted,
    Validation: UtilsValidation,
    Build: UtilsBuild,

    ...Parse
}