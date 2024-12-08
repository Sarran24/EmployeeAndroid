const BASE_URL = "http://192.168.1.15:8080/api/employee"; // Your backend API base URL
const EMPLOYEES_URL = "http://192.168.1.15:8080/api/employees"; // Separate URL for fetching all employees
// Interface for Employee to ensure type safety
interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  isActive: boolean;
  profilePicture: string;
  departmentId: string | null;
  roleId: string | null;
}

/**
 * Fetch all active employees
 * @returns {Promise<Employee[]>} - The list of employees
 */
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(EMPLOYEES_URL); // Fetching from the separated endpoint
    if (!response.ok) {
      throw new Error(`Error fetching employees: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the response has a 'body' property and filter out empty objects
    const employees = data.body
      ? data.body.filter(
          (emp: Partial<Employee>) =>
            emp.id && emp.name && emp.position !== undefined
        )
      : [];

    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

/**
 * Fetch a single employee by ID
 * @param {string} id - The ID of the employee to fetch (id is a string now)
 * @returns {Promise<Employee>} - The employee details
 */
export const getEmployee = async (id: string): Promise<Employee> => {
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
export const createEmployee = async (data: Employee): Promise<Employee> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating employee: ${response.statusText}`);
    }

    return await response.json(); // Return the created employee
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

/**
 * Update an existing employee
 * @param {string} id - The ID of the employee to update
 * @param {Employee} data - The updated employee data
 * @returns {Promise<Employee>} - The updated employee
 */
export const updateEmployee = async (
  id: string,
  data: Employee
): Promise<Employee> => {
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
 * Deactivate (soft delete) an employee
 * @param {string} id - The ID of the employee to deactivate
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deactivating employee: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deactivating employee with id ${id}:`, error);
    throw error;
  }
};

/**
 * Upload a profile picture for an employee
 * @param {string} id - The ID of the employee
 * @param {FormData} formData - The FormData object containing the file
 * @returns {Promise<void>}
 */
export const uploadProfilePicture = async (
  id: string,
  base64Image: string
): Promise<void> => {
  
  try {
    const response = await fetch(`${BASE_URL}/profile/picture/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profilePicture: base64Image }),
      
    });

    if (!response.ok) {
      throw new Error(
        `Error uploading profile picture: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(
      `Error uploading profile picture for employee with id ${id}:`,
      error
    );
    throw error;
  }
};

/**
 * Get the profile picture of an employee
 * @param {string} id - The ID of the employee
 * @returns {Promise<string>} - The URL of the profile picture
 */
export const getProfilePicture = async (id: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/profile/picture/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching profile picture: ${response.statusText}`);
    }
    const pictureUrl = await response.text();
    return pictureUrl; // Assuming the response is a URL for the image
  } catch (error) {
    console.error(
      `Error fetching profile picture for employee with id ${id}:`,
      error
    );
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
  uploadProfilePicture,
  getProfilePicture,
};
