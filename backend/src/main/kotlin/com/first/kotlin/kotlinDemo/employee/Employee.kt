package com.first.kotlin.kotlinDemo.employee

import com.google.cloud.firestore.annotation.PropertyName

class Employee(
    @PropertyName("name") private var _name: String,
    @PropertyName("position") private var _position: String,
    @PropertyName("salary") private var _salary: Double,
    @field:PropertyName("active") private var _isActive: Boolean = true,
    private var _id: String? = null
) {
    constructor() : this("", "", 0.0, true, null)
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

    var id: String?
        get() = _id
        set(value) {
            _id = value
        }

    override fun toString(): String {
        return "Employee(name='$_name', position='$_position', salary=$_salary, isActive=$_isActive, id=$_id)"
    }
}