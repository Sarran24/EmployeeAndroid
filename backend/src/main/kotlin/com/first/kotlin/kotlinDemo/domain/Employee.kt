package com.first.kotlin.kotlinDemo.domain

import com.google.cloud.firestore.annotation.PropertyName

data class Employee(
    @PropertyName("name") var name: String = "",
    @PropertyName("position") var position: String = "",
    @PropertyName("salary") var salary: Double = 0.0,
    @PropertyName("profilePicture") var profilePicture: String = "",
    @PropertyName("isActive") var isActive: Boolean = true,
    @PropertyName("departmentId") var departmentId: String? = null,
    @PropertyName("roleId") var roleId: String? = null,
   @field:PropertyName("id") var id: String? = null
) {
    init {
        // Ensure salary is non-negative
        if (salary < 0) throw IllegalArgumentException("Salary cannot be negative")
    }
}
