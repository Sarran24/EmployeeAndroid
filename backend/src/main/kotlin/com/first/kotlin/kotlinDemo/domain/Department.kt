package com.first.kotlin.kotlinDemo.domain

import com.google.cloud.firestore.annotation.PropertyName

data class Department(
    @PropertyName("name") private var _name: String,
    @PropertyName("location") private var _location: String,
    @PropertyName("budget") private var _budget: Double,
    @PropertyName("isActive") private var _isActive: Boolean = true,
    @field:PropertyName("id") private var _id: String? = null
) {
    constructor() : this("", "", 0.0, true, null)

    var name: String
        get() = _name
        set(value) {
            _name = value
        }

    var location: String
        get() = _location
        set(value) {
            _location = value
        }

    var budget: Double
        get() = _budget
        set(value) {
            _budget = value
        }

    var isActive: Boolean
        get() = _isActive
        set(value) {
            _isActive = value
        }

    var id: String?
        get() = _id
        set(value) {
            _id = value
        }
}
