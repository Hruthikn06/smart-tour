import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

model = tf.keras.models.load_model("./my_model.keras")
img_size = (180,180)
class_names = ['apple', 'monkey']

def predict_image(img_path):
    img = image.load_img(img_path, target_size=img_size)
    img_array = image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # Create batch axis

    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])

    print(
        f"This image most likely belongs to '{class_names[np.argmax(score)]}' "
        f"with a {100 * np.max(score):.2f}% confidence."
    )

# Example usage
predict_image("./apple-test.jpg")