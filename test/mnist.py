import numpy as np
import urllib.request
import gzip
import os

# Activation functions
def relu(x):
    return np.maximum(0, x)

def relu_derivative(x):
    return (x > 0).astype(float)

def softmax(x):
    exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=1, keepdims=True)

# Loss function (Cross-entropy)
def cross_entropy_loss(y_true, y_pred):
    m = y_true.shape[0]
    return -np.sum(y_true * np.log(y_pred + 1e-8)) / m

# One-hot encoding
def one_hot(y, num_classes=10):
    return np.eye(num_classes)[y]

# Initialize network parameters
def initialize_parameters(input_size=784, hidden_size=128, output_size=10):
    np.random.seed(42)
    W1 = np.random.randn(input_size, hidden_size) * 0.01
    b1 = np.zeros((1, hidden_size))
    W2 = np.random.randn(hidden_size, output_size) * 0.01
    b2 = np.zeros((1, output_size))
    return W1, b1, W2, b2

# Forward propagation
def forward_propagation(X, W1, b1, W2, b2):
    Z1 = np.dot(X, W1) + b1
    A1 = relu(Z1)
    Z2 = np.dot(A1, W2) + b2
    A2 = softmax(Z2)
    return Z1, A1, Z2, A2

# Backward propagation
def backward_propagation(X, Y, Z1, A1, A2, W2):
    m = X.shape[0]
    dZ2 = A2 - Y
    dW2 = np.dot(A1.T, dZ2) / m
    db2 = np.sum(dZ2, axis=0, keepdims=True) / m
    dZ1 = np.dot(dZ2, W2.T) * relu_derivative(Z1)
    dW1 = np.dot(X.T, dZ1) / m
    db1 = np.sum(dZ1, axis=0, keepdims=True) / m
    return dW1, db1, dW2, db2

# Training the network
def train(X_train, Y_train, learning_rate=0.01, epochs=1000):
    W1, b1, W2, b2 = initialize_parameters()
    
    for epoch in range(epochs):
        Z1, A1, Z2, A2 = forward_propagation(X_train, W1, b1, W2, b2)
        loss = cross_entropy_loss(Y_train, A2)
        
        dW1, db1, dW2, db2 = backward_propagation(X_train, Y_train, Z1, A1, A2, W2)
        
        # Update weights
        W1 -= learning_rate * dW1
        b1 -= learning_rate * db1
        W2 -= learning_rate * dW2
        b2 -= learning_rate * db2
        
        if epoch % 100 == 0:
            print(f"Epoch {epoch}: Loss = {loss:.4f}")
        
    # Save the model after training
    save_model(W1, b1, W2, b2)
        
    return W1, b1, W2, b2

# Prediction function
def predict(X, W1, b1, W2, b2):
    _, _, _, A2 = forward_propagation(X, W1, b1, W2, b2)
    return np.argmax(A2, axis=1)

# Load MNIST dataset manually
def load_mnist():
    def load_images(filename):
        with open(filename, 'rb') as f:
            f.read(4)  # Skip magic number
            num_images = int.from_bytes(f.read(4), 'big')
            rows = int.from_bytes(f.read(4), 'big')
            cols = int.from_bytes(f.read(4), 'big')
            return np.frombuffer(f.read(), np.uint8).reshape(num_images, rows * cols) / 255.0

    def load_labels(filename):
        with open(filename, 'rb') as f:
            f.read(4)  # Skip magic number
            num_labels = int.from_bytes(f.read(4), 'big')
            return np.frombuffer(f.read(), np.uint8)

    files = {
        "train_images": "train-images-idx3-ubyte",
        "train_labels": "train-labels-idx1-ubyte",
        "test_images": "t10k-images-idx3-ubyte",
        "test_labels": "t10k-labels-idx1-ubyte"
    }

    for file in files.values():
        if not os.path.exists(file):
            raise FileNotFoundError(f"Dataset file {file} not found. Ensure it is in the script's directory.")

    X_train = load_images(files["train_images"])
    Y_train = load_labels(files["train_labels"])
    X_test = load_images(files["test_images"])
    Y_test = load_labels(files["test_labels"])

    Y_train, Y_test = one_hot(Y_train), one_hot(Y_test)

    return X_train, Y_train, X_test, Y_test

# Load preprocessed dataset
X_train, Y_train, X_test, Y_test = load_mnist()


# Save the trained model parameters
def save_model(W1, b1, W2, b2, filename="mnist_model.npz"):
    np.savez(filename, W1=W1, b1=b1, W2=W2, b2=b2)
    print(f"Model saved to {filename}")


# Load the trained model parameters
def load_model(filename="mnist_model.npz"):
    data = np.load(filename)
    W1, b1, W2, b2 = data["W1"], data["b1"], data["W2"], data["b2"]
    print(f"Model loaded from {filename}")
    return W1, b1, W2, b2

# Load trained model

file_name = "mnist_model.npz"

if os.path.exists(file_name):
    print("Loading Model.")
    W1, b1, W2, b2 = load_model()
else:
    print("traning model")
    W1, b1, W2, b2 = train(X_train, Y_train, learning_rate=0.01, epochs=1000)

print("Enter choice")
c = input()
if(c):
    predictions = predict(X_test, W1, b1, W2, b2)

    # Compute accuracy
    accuracy = np.mean(predictions == np.argmax(Y_test, axis=1))
    print(f"Test Accuracy (Loaded Model): {accuracy:.4f}")
