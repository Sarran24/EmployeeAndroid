package com.first.kotlin.kotlinDemo.domain

import com.google.cloud.firestore.annotation.PropertyName

data class Employee(
    @PropertyName("name") private var _name: String,
    @PropertyName("position") private var _position: String,
    @PropertyName("salary") private var _salary: Double,
    @PropertyName("profilePicture") private var _profilePicture: String,
    @field:PropertyName("isActive") private var _isActive: Boolean = true,
    @field:PropertyName("departmentId") private var _departmentId: String? = null,
    @field:PropertyName("roleId") private var _roleId: String? = null,
    private var _id: String? = null
) {
    constructor() : this("", "", 0.0, "", true, null, null, null)

    var name: String
        get() = _name
        set(value) {
            _name = value
        }

    var position: String
        get() = _position
        set(value) {
            _position = value
        }

    var salary: Double
        get() = _salary
        set(value) {
            if (value >= 0) {
                _salary = value
            } else {
                throw IllegalArgumentException("Salary cannot be negative")
            }
        }

    var isActive: Boolean
        get() = _isActive
        set(value) {
            _isActive = value
        }

    var departmentId: String?
        get() = _departmentId
        set(value) {
            _departmentId = value
        }

    var roleId: String?
        get() = _roleId
        set(value) {
            _roleId = value
        }

    var id: String?
        get() = _id
        set(value) {
            _id = value
        }

    var profilePicture: String
        get() = _profilePicture
        set(value) {
            _profilePicture = value
        }
}
