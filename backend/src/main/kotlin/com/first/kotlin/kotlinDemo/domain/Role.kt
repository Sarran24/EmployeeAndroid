package com.first.kotlin.kotlinDemo.domain

import com.google.cloud.firestore.annotation.PropertyName

data class Role(
    @PropertyName("name") private var _name: String,
    @PropertyName("description") private var _description: String,
    @field:PropertyName("id") private var _id: String? = null,
    @PropertyName("departmentId") private var _departmentId: String
) {
    constructor() : this("", "", null, "")

    var name: String
        get() = _name
        set(value) {
            _name = value
        }

    var description: String
        get() = _description
        set(value) {
            _description = value
        }

    var id: String?
        get() = _id
        set(value) {
            _id = value
        }

    var departmentId: String
        get() = _departmentId
        set(value) {
            _departmentId = value
        }
}
