package com.first.kotlin.kotlinDemo.dto

data class EmployeeDTO(
    val id: String?,
    val name: String,
    val position: String,
    val salary: Double,
    val profilePicture: String,
    val isActive: Boolean,
    val departmentId: String?,
    val roleId: String?
)
