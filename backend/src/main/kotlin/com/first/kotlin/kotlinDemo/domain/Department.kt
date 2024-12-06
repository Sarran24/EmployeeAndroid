package com.first.kotlin.kotlinDemo.domain
import com.google.cloud.firestore.annotation.PropertyName

data class Department @JvmOverloads constructor(
    @PropertyName("name") private var _name: String,    // Name of the department
    @PropertyName("location") private var _location: String, // Department location
    @PropertyName("budget") private var _budget: Double, // Department's budget
    @PropertyName("isActive") private var _isActive: Boolean = true, // Whether the department is active
    @field:PropertyName("id") private var _id: String? = null // Department ID, this will be auto-generated

) {
    // No-argument constructor required by Firestore (For deserialization)
    constructor() : this("", "", 0.0, true, null)

    // Public getter and setter methods for encapsulation
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
