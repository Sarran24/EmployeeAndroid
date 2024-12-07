package com.first.kotlin.kotlinDemo.dto

data class DepartmentDTO(
    val id: String?,
    val name: String,
    val location: String,
    val budget: Double,
    val isActive: Boolean,
    val roles: List<RoleDTO> = emptyList()
)
