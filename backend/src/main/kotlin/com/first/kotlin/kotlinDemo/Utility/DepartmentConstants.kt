package com.first.kotlin.kotlinDemo.Utility

object DepartmentConstants {

    const val HUMAN_RESOURCES = "Human Resources"
    const val SALES = "Sales"
    const val MARKETING = "Marketing"
    const val FINANCE_AND_ACCOUNTING = "Finance and Accounting"
    const val INFORMATION_TECHNOLOGY = "Information Technology"
    const val OPERATIONS_AND_LOGISTICS = "Operations and Logistics"
    const val CUSTOMER_SERVICE = "Customer Service"
    const val LEGAL_AND_COMPLIANCE = "Legal and Compliance"
    const val PRODUCT_DEVELOPMENT_AND_MANAGEMENT = "Product Development and Management"
    const val EXECUTIVE_LEADERSHIP_AND_STRATEGY = "Executive Leadership and Strategy"
    const val CUSTOMER_INSIGHTS_AND_ANALYTICS = "Customer Insights and Analytics"
    const val PROJECT_MANAGEMENT = "Project Management"

    val VALID_DEPARTMENTS = setOf(
        HUMAN_RESOURCES,
        SALES,
        MARKETING,
        FINANCE_AND_ACCOUNTING,
        INFORMATION_TECHNOLOGY,
        OPERATIONS_AND_LOGISTICS,
        CUSTOMER_SERVICE,
        LEGAL_AND_COMPLIANCE,
        PRODUCT_DEVELOPMENT_AND_MANAGEMENT,
        EXECUTIVE_LEADERSHIP_AND_STRATEGY,
        CUSTOMER_INSIGHTS_AND_ANALYTICS,
        PROJECT_MANAGEMENT
    )
}
