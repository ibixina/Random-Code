import numpy as np

class DropoutLayer:
    """
    Implements the dropout layer for a neural network.

    During forward propagation, randomly sets a fraction (p) of the
    input units to 0. This helps prevent overfitting.

    During backward propagation, scales the gradients of the active units
    by 1/(1-p) to compensate for the dropped units during forward pass.
    """

    def __init__(self, p=0.5):
        """
        Initializes the dropout layer.

        Args:
            p (float): Probability of dropping out a neuron (between 0 and 1).
                       Default is 0.5.
        """
        if not 0 <= p < 1:
            raise ValueError("Dropout probability 'p' must be between 0 and 1 (exclusive of 1).")
        self.p = p
        self.mask = None  # Stores the dropout mask during forward pass
        self.training = True # Flag to indicate if the layer is in training mode

    def forward(self, X):
        """
        Performs the forward pass of the dropout layer.

        Args:
            X (numpy.ndarray): Input data (batch_size, num_features).

        Returns:
            numpy.ndarray: Output data with dropout applied.
        """
        if self.training:
            # Create a random mask with probability (1-p) of being 1 and p of being 0
            self.mask = (np.random.rand(*X.shape) > self.p).astype(int)
            # Apply the mask to the input
            return X * self.mask
        else:
            # During testing/inference, do not apply dropout.
            # Instead, scale the activations by (1-p) to account for the
            # fact that more neurons were active during training.
            return X * (1 - self.p)

    def backward(self, upstream_gradient):
        """
        Performs the backward pass of the dropout layer.

        Args:
            upstream_gradient (numpy.ndarray): Gradient received from the next layer.

        Returns:
            numpy.ndarray: Gradient to be passed to the previous layer.
        """
        if self.training:
            # Apply the same mask used during the forward pass to the upstream gradient
            return upstream_gradient * self.mask
        else:
            # No dropout applied during forward pass in inference, so the
            # backward pass is simply passing the gradient through.
            return upstream_gradient

    def train(self, mode=True):
        """
        Sets the training mode of the dropout layer.

        Args:
            mode (bool): True for training mode (dropout active), False for
                         evaluation mode (dropout inactive).
        """
        self.training = mode

# Example Usage in a Simple Neural Network:

class DenseLayer:
    def __init__(self, input_size, output_size):
        self.weights = np.random.randn(input_size, output_size) * 0.01
        self.biases = np.zeros((1, output_size))
        self.input = None

    def forward(self, X):
        self.input = X
        return np.dot(X, self.weights) + self.biases

    def backward(self, upstream_gradient, learning_rate):
        dW = np.dot(self.input.T, upstream_gradient)
        db = np.sum(upstream_gradient, axis=0, keepdims=True)
        dX = np.dot(upstream_gradient, self.weights.T)

        self.weights -= learning_rate * dW
        self.biases -= learning_rate * db
        return dX

class ReLU:
    def forward(self, X):
        self.output = np.maximum(0, X)
        return self.output

    def backward(self, upstream_gradient):
        return upstream_gradient * (self.output > 0)

# Dummy data
X_train = np.random.randn(100, 10)
y_train = np.random.randint(0, 2, 100).reshape(-1, 1)

# Define a simple network with dropout
input_size = X_train.shape[1]
hidden_size = 5
output_size = 1
learning_rate = 0.01
epochs = 10

# Layers
dense1 = DenseLayer(input_size, hidden_size)
relu1 = ReLU()
dropout1 = DropoutLayer(p=0.5)  # Dropout with 50% probability
dense2 = DenseLayer(hidden_size, output_size)

# Training loop
for epoch in range(epochs):
    # Forward pass (training mode is True by default)
    hidden_output = dense1.forward(X_train)
    relu_output = relu1.forward(hidden_output)
    dropout_output = dropout1.forward(relu_output)
    final_output = dense2.forward(dropout_output)

    # Simulate a simple loss (for demonstration)
    loss = np.mean((final_output - y_train)**2)
    print(f"Epoch {epoch+1}, Loss: {loss:.4f}")

    # Backward pass
    d_final_output = 2 * (final_output - y_train) / y_train.size
    d_dropout_output = dense2.backward(d_final_output, learning_rate)
    d_relu_output = dropout1.backward(d_dropout_output)
    d_hidden_output = relu1.backward(d_relu_output)
    dense1.backward(d_hidden_output, learning_rate)

# Evaluation (set dropout to evaluation mode)
dropout1.train(False)
X_test = np.random.randn(20, 10)
test_output = dense1.forward(X_test)
relu_test = relu1.forward(test_output)
dropout_test = dropout1.forward(relu_test) # Dropout will not be applied
final_test_output = dense2.forward(dropout_test)
print("\nTest Output (Dropout inactive):")
print(final_test_output[:5])
