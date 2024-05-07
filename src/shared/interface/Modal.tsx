import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or any other icon library you prefer

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  isError?: boolean;
  content: string;
}

const PopupWithCloseIcon: React.FC<PopupProps> = ({ isVisible, onClose, isError = false, content }) => {
  const renderIcon = () => {
    if (isError ) {
      return <Icon name="times-circle" size={50} color="red" />;
    } else {
      return <Icon name="check-circle" size={50} color="green" />;
    }
  };

  const modalStyles = isError ? styles.errorModal : styles.successModal;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[styles.modal, modalStyles]}>
          <Text style={styles.title}>{ isError ? 'Error' : 'Success'}</Text>
          <Text style={styles.content}>{content}</Text>
          <View style={styles.iconContainer}>{renderIcon()}</View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="times" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Adjust the width as needed
    alignItems: 'center',
    position: 'relative',
  },
  errorModal: {
    borderColor: 'red',
    borderWidth: 2,
  },
  successModal: {
    borderColor: 'green',
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
});

export default PopupWithCloseIcon;
