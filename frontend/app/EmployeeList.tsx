import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchEmployees, deleteEmployee } from './api';

// Import the blank profile picture
const blankProfilePicture = require('../assets/images/blank-profile-picture.png');

interface Employee {
    id: string;
    name: string;
    position: string;
    salary: number;
    profilePicture: string;
    isActive: boolean;
}

const EmployeeList: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>('alphabetical');
    const [isLoading, setIsLoading] = useState(false);

    // Memoized load employees function
    const loadEmployees = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchEmployees();
            if (Array.isArray(result)) {
                setEmployees(result);
                // Trigger initial sorting
                sortEmployees(result, sortOption);
            } else {
                throw new Error('API did not return an array of employees');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Failed to load employees');
            setEmployees([]);
            setSortedEmployees([]);
        } finally {
            setIsLoading(false);
        }
    }, [sortOption]);

    // Separate sorting logic
    const sortEmployees = useCallback((employeeList: Employee[], option: string) => {
        let sortedList = [...employeeList];
        if (option === 'alphabetical') {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (option === 'salary') {
            sortedList.sort((a, b) => b.salary - a.salary);
        }
        setSortedEmployees(sortedList);
    }, []);

    // Initial load
    useEffect(() => {
        loadEmployees();
    }, []);

    // Refresh when screen is focused
    useFocusEffect(
        useCallback(() => {
            loadEmployees();
            return () => { }; // Cleanup if needed
        }, [loadEmployees])
    );

    // Handle sort option change
    useEffect(() => {
        sortEmployees(employees, sortOption);
    }, [sortOption, employees, sortEmployees]);

    const handleDeleteEmployee = async (id: string) => {
        try {
            await deleteEmployee(id.toString());
            setEmployees((prevEmployees) =>
                prevEmployees.filter((employee) => employee.id !== id)
            );
        } catch (error) {
            console.error('Error deleting employee:', error);
            Alert.alert('Error', 'Failed to delete employee');
        }
    };

    const renderEmployeeItem = ({ item }: { item: Employee }) => (
        <View style={styles.employeeCard}>
            <TouchableOpacity
                style={styles.employeeDetails}
                onPress={() =>
                    navigation.navigate('UpdateEmployee', { employeeId: item.id })
                }
            >
                <Image
                    source={
                        item.profilePicture && item.profilePicture.trim() !== ''
                            ? { uri: item.profilePicture }
                            : blankProfilePicture
                    }
                    style={styles.profilePicture}
                    defaultSource={blankProfilePicture}
                />
                <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{item.name}</Text>
                    <Text style={styles.employeePosition}>
                        Position: {item.position}
                    </Text>
                    <Text style={styles.employeeSalary}>
                        Salary: ${item.salary.toLocaleString()}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleDeleteEmployee(item.id)}
                    style={styles.deleteButton}
                >
                    <Icon name="trash" size={20} color="#FF6347" />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );

    // Render error state
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity onPress={loadEmployees} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <Picker
                    selectedValue={sortOption}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSortOption(itemValue)}
                >
                    <Picker.Item label="Alphabetical" value="alphabetical" />
                    <Picker.Item label="Salary" value="salary" />
                </Picker>
            </View>
            <FlatList
                data={sortedEmployees}
                keyExtractor={(item) => item.id}
                renderItem={renderEmployeeItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={loadEmployees}
                        colors={['#007BFF']}
                        tintColor="#007BFF"
                    />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>
                        {isLoading ? 'Loading employees...' : 'No employees found.'}
                    </Text>
                }
            />
            {/* Add New Employee Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateEmployee')}
            >
                <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#1e1e1e',
        backgroundColor: '#f8f9fa',
    },
    listContent: {
        padding: 16,
    },
    employeeCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        // flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    employeeDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    employeeInfo: {
        flex: 1,
    },
    employeeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    employeePosition: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    employeeSalary: {
        fontSize: 14,
        color: '#007BFF',
    },
    headerButton: {
        marginRight: 16,
        padding: 8,
    },
    deleteButton: {
        marginRight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#dc3545',
        textAlign: 'center',
    },
    emptyMessage: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 20,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    sortLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 8,
    },
    picker: {
        flex: 1,
        color: '#007BFF',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56, // Standardized size
        height: 56, // Square button
        borderRadius: 28, // Fully rounded
        backgroundColor: '#007BFF', // Vibrant blue
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6, // Enhanced shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconStyle: {
        color: 'white',
        // Remove previous styling
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    // ... (rest of the styles remain the same)
});

export default EmployeeList;