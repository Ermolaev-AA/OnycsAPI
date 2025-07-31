import * as Get from './get.js'
import * as Post from './post.js'
import * as Patch from './patch.js'
import * as Delete from './delete.js'

export default {
    ...Get,
    ...Post,
    ...Patch,
    ...Delete
}