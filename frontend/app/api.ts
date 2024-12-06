const BASE_URL = "http://192.168.1.8:8080/employees"; // Your backend API base URL

// Interface for Employee to ensure type safety
interface Employee {
  id?: string;
  name: string;
  position: string;
  salary: number;
}

/**
 * Fetch all employees
 * @returns {Promise<Employee[]>} - The list of employees
 */
export const fetchEmployees = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Error fetching employees: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

/**
 * Fetch a single employee by ID
 * @param {number} id - The ID of the employee to fetch
 * @returns {Promise<Employee>} - The employee details
 */
export const getEmployee = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching employee: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new employee
 * @param {Employee} data - The employee data to create
 * @returns {Promise<Employee>} - The created employee
 */
export const createEmployee = async (data: Employee) => {
  try {
    console.log("Sending payload to backend:", JSON.stringify(data)); // Log request payload

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status); // Log response status

    const responseBody = await response.text();
    console.log("Response body:", responseBody); // Log response body

    if (!response.ok) {
      throw new Error(`Error creating employee: ${response.statusText}`);
    }

    return JSON.parse(responseBody); // Parse and return the JSON
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

/**
 * Update an existing employee
 * @param {number} id - The ID of the employee to update
 * @param {Employee} data - The updated employee data
 * @returns {Promise<Employee>} - The updated employee
 */
export const updateEmployee = async (id: number, data: Employee) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating employee: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an employee
 * @param {number} id - The ID of the employee to delete
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting employee: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};

export type { Employee };
export default {
  fetchEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
