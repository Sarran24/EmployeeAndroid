import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { getEmployee, updateEmployee } from './api';
import Icon from 'react-native-vector-icons/AntDesign';
const blankProfilePicture = require('../assets/images/blank-profile-picture.png');
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePicture } from './api';

const { width } = Dimensions.get('window');

const UpdateEmployeeScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { employeeId } = route.params;
    const [employee, setEmployee] = useState<any>(null);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState<number | string>('');
    const [profilePicture, setProfilePicture] = useState<string>(blankProfilePicture);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const employeeData = await getEmployee(employeeId);
                setEmployee(employeeData);
                setName(employeeData.body.name || '');
                setPosition(employeeData.body.position || '');
                setSalary(employeeData.body.salary || '');

                const fetchedProfilePicture = employeeData?.body?.profilePicture;
                if (fetchedProfilePicture) {
                    const processedProfilePicture = fetchedProfilePicture.startsWith('data:image')
                        ? fetchedProfilePicture
                        : `data:image/jpeg;base64,${fetchedProfilePicture}`;
                    setProfilePicture(processedProfilePicture);
                } else {
                    setProfilePicture(blankProfilePicture);
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
            }
        };
        fetchEmployeeDetails();
    }, [employeeId]);

    const handleImageSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Permission to access the gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            base64: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setProfilePicture(base64Image);

            await handleUploadProfilePicture(employeeId, base64Image);
        } else {
            Alert.alert('No Image Selected', 'You did not select any image.');
        }
    };

    const handleUploadProfilePicture = async (employeeId: string, base64Image: string) => {
        try {
            await uploadProfilePicture(employeeId, base64Image);
            Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            Alert.alert('Error', 'Failed to update profile picture');
        }
    };

    const handleUpdateEmployee = async () => {
        if (!name || !position || salary === '') {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const updatedEmployee = {
            id: employeeId,
            name,
            position,
            salary: typeof salary === 'string' ? parseFloat(salary) : salary,
            profilePicture: profilePicture !== blankProfilePicture ? profilePicture : null,
            isActive: true,
            departmentId: null,
            roleId: null,
        };

        try {
            await updateEmployee(employeeId, updatedEmployee);
            Alert.alert('Success', 'Employee updated successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Error updating employee:', error);
            Alert.alert('Error', 'Failed to update employee');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profilePictureContainer}>
                <Image
                    source={
                        profilePicture && profilePicture !== blankProfilePicture
                            ? { uri: profilePicture }
                            : blankProfilePicture
                    }
                    style={styles.profilePicture}
                    placeholder={blankProfilePicture}
                    contentFit="cover"
                />
                <TouchableOpacity style={styles.addIconContainer} onPress={handleImageSelect}>
                    <Icon name="camerao" size={24} color="#1e1e1e" />
                </TouchableOpacity>
            </View>

            <View style={styles.updateForm}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Position"
                    value={position}
                    onChangeText={setPosition}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Salary"
                    value={salary.toString()}
                    onChangeText={(text) => setSalary(text)}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdateEmployee}>
                <Text style={styles.buttonText}>Update Employee</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    profilePicture: {
        width: width * 0.3,  // 30% of screen width
        height: width * 0.3, // 30% of screen width
        borderRadius: (width * 0.3) / 2,
        borderWidth: 4,
        borderColor: 'white',
        alignSelf: 'center',
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    addIconContainer: {
        position: 'absolute',
        bottom: -10,  // Positioned below the profile picture
        right: width * 0.3,  // Aligned with the right edge of the profile picture
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    updateForm: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        width: '50%',  // Reduce button width to 80% of container
        alignSelf: "center", // Center the button horizontally
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UpdateEmployeeScreen;