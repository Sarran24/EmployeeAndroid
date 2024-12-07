import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TextInput, TouchableOpacity } from 'react-native';
import { getEmployee, uploadProfilePicture } from './api';
import * as ImagePicker from 'expo-image-picker';
import blankProfilePicture from '../assets/images/blank-profile-picture.png';
import Icon from 'react-native-vector-icons/AntDesign'; 

const UpdateEmployeeScreen = ({ route }: { route: any }) => {
    const { employeeId } = route.params;
    const [employee, setEmployee] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [salary, setSalary] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const employeeData = await getEmployee(employeeId);
                setEmployee(employeeData);
                setName(employeeData.body.name);
                setPosition(employeeData.body.position);
                setSalary(employeeData.body.salary.toString());
                setProfilePicture(employeeData.body.profilePicture || null);
            } catch (error) {
                console.error("Error fetching employee details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, [employeeId]);


    const handleSave = async () => {
        // Save employee details along with the updated profile picture
        try {
            const updatedEmployeeData = {
                name,
                position,
                salary,
                profilePicture,
            };

            console.log("Saving employee data:", updatedEmployeeData);

            // You can also send this data to your server to update the employee record.
            // For example, you can use a POST request to update the employee details.

        } catch (error) {
            console.error("Error saving employee details:", error);
        }
    };

    const handleImageSelect = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access the gallery is required!');
            return;
        }

        // Launch the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Correct mediaTypes usage
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            // Set selected image URI if available
            console.log(result)
            setProfilePicture(result.assets[0].uri);
        }
        // } else {
        //     // Handle cancellation or no image selected
        //     alert('You did not select any image.');
        // }
    };

    // const handleImageSelect = async () => {
    //     // Request permissions
    //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (status !== 'granted') {
    //         alert('Permission to access the gallery is required!');
    //         return;
    //     }

    //     // Launch the image library
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ['images'],
    //         allowsEditing: true,
    //         quality: 1,
    //     });

    //     if (!result.canceled && result.assets && result.assets.length > 0) {
    //         const selectedImageUri = result.assets[0].uri;

    //         // If the image URI is already base64-encoded, just upload it directly
    //         try {
    //             await uploadProfilePicture(employeeId, selectedImageUri); // Use the URI directly
    //             setProfilePicture(selectedImageUri); // Update local state with the selected image URI
    //         } catch (error) {
    //             console.error("Error uploading profile picture:", error);
    //         }
    //     } else {
    //         alert('You did not select any image.');
    //     }
    // };


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!employee) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Employee not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Profile Picture Section */}
            <View style={styles.profilePictureContainer}>
                <Image
                    source={profilePicture ? { uri: profilePicture } : blankProfilePicture}
                    style={styles.profilePicture}
                />
                <TouchableOpacity style={styles.addIconContainer} onPress={handleImageSelect}>
                    {/* Use the camerao icon instead of + */}
                    <Icon name="camerao" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Name Input */}
            <Text style={styles.label}>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Enter name"
            />

            {/* Position Input */}
            <Text style={styles.label}>Position</Text>
            <TextInput
                value={position}
                onChangeText={setPosition}
                style={styles.input}
                placeholder="Enter position"
            />

            {/* Salary Input */}
            <Text style={styles.label}>Salary</Text>
            <TextInput
                value={salary}
                onChangeText={setSalary}
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter salary"
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    profilePictureContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginTop: 12,
        alignSelf: 'flex-start',
        marginLeft: 16,
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 20,
        padding: 5,
        elevation: 5,
    },
    addIcon: {
        color: '#1e1e1e',
        backgroundColor:'black',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        width: '90%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    saveButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#0073fe',
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default UpdateEmployeeScreen;
