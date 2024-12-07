package com.first.kotlin.kotlinDemo.mapper

import com.first.kotlin.kotlinDemo.domain.Department
import com.first.kotlin.kotlinDemo.dto.DepartmentDTO
import com.first.kotlin.kotlinDemo.dto.RoleDTO

object DepartmentMapper {
    fun toDTO(department: Department, roles: List<RoleDTO>): DepartmentDTO {
        return DepartmentDTO(
            id = department.id,
            name = department.name,
            location = department.location,
            budget = department.budget,
            isActive = department.isActive,
            roles = roles
        )
    }
}