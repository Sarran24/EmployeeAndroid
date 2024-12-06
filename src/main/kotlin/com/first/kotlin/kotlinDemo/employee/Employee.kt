package com.first.kotlin.kotlinDemo.employee
import com.google.cloud.firestore.annotation.PropertyName

data class Employee(
    @PropertyName("name") val name: String = "",
    @PropertyName("position") val position: String = "",
    @PropertyName("salary") val salary: Double = 0.0,
    @field:PropertyName("active")
    var isActive: Boolean = true ,
    var id: String? = null
)

