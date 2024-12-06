import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchEmployees, deleteEmployee } from './api';

interface Employee {
    id: number;
    name: string;
    position: string;
    salary: number;
}

const EmployeeList: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>('alphabetical');

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const result = await fetchEmployees();
                setEmployees(result);
                setSortedEmployees(result); // Initial sorting
            } catch (error) {
                console.error('Error fetching employees:', error);
                setError('Failed to load employees');
            }
        };

        loadEmployees();

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateEmployee')}
                    style={styles.headerButton}
                >
                    <Icon name="plus" size={24} color="#007BFF" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // Sorting logic
    useEffect(() => {
        let sortedList = [...employees];
        if (sortOption === 'alphabetical') {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'salary') {
            sortedList.sort((a, b) => b.salary - a.salary);
        }
        setSortedEmployees(sortedList);
    }, [sortOption, employees]);

    const handleDeleteEmployee = async (id: number) => {
        try {
            await deleteEmployee(id);
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
                    navigation.navigate('UpdateEmployee', { employee: item })
                }
            >
                <Text style={styles.employeeName}>{item.name}</Text>
                <Text>TestGit2</Text>
                <Text style={styles.employeePosition}>
                    Position: {item.position}
                </Text>
                <Text style={styles.employeeSalary}>
                    Salary: ${item.salary.toLocaleString()}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleDeleteEmployee(item.id)}
                style={styles.deleteButton}
            >
                <Icon name="trash" size={24} color="#FF6347" />
            </TouchableOpacity>
        </View>
    );

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEmployeeItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>No employees found.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    employeeDetails: {
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
        marginLeft: 16,
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
});

export default EmployeeList;
