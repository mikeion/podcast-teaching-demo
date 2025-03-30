#!/usr/bin/env python3
import os
from local_tts import text_to_speech

def test_tts():
    # Longer sample text with various characteristics to test:
    # - Multiple paragraphs
    # - Complex technical content
    # - Lists and bullet points
    # - Different types of punctuation
    # - Natural conversation flow
    # - Technical terms and acronyms
    sample_text = """
    Welcome to our comprehensive guide on artificial intelligence and machine learning! Today, we'll dive deep into the fascinating world of AI, exploring its history, current applications, and future potential.

    Let's start with a brief history of artificial intelligence. The field was officially founded in 1956 at the Dartmouth Conference, where the term "artificial intelligence" was first coined. Early pioneers like Alan Turing, John McCarthy, and Marvin Minsky laid the groundwork for what would become one of the most transformative technologies of our time.

    In the early days, AI research focused on symbolic AI and rule-based systems. These systems were designed to follow explicit rules and manipulate symbols to solve problems. However, they struggled with tasks that humans find intuitive, such as recognizing objects or understanding natural language.

    The modern era of AI began with the rise of machine learning, particularly deep learning. Deep learning uses artificial neural networks with multiple layers (hence "deep") to learn patterns from data. These networks are inspired by the human brain's structure and function, with layers of interconnected nodes that process and transmit information.

    Let's break down the key components of a modern AI system:

    1. Data Collection and Preprocessing
       - Gathering high-quality training data
       - Cleaning and normalizing the data
       - Feature engineering and selection

    2. Model Architecture
       - Choosing the right neural network structure
       - Determining the number of layers
       - Selecting activation functions

    3. Training Process
       - Forward propagation
       - Loss calculation
       - Backpropagation
       - Weight optimization

    4. Evaluation and Deployment
       - Model validation
       - Performance metrics
       - Production deployment

    One of the most exciting developments in recent years has been the emergence of large language models (LLMs) like GPT-3, BERT, and their successors. These models have demonstrated remarkable capabilities in:
    - Natural language understanding
    - Text generation
    - Code completion
    - Question answering
    - Language translation

    However, with great power comes great responsibility. AI systems raise important ethical considerations:
    - Bias and fairness
    - Privacy and data protection
    - Transparency and explainability
    - Safety and reliability
    - Impact on employment

    Looking to the future, we can expect several exciting developments:
    1. More efficient and environmentally friendly AI models
    2. Better integration of AI with other technologies
    3. Improved handling of edge cases and uncertainty
    4. Enhanced focus on AI safety and ethics
    5. Greater accessibility to AI tools and resources

    As we continue to advance in this field, it's crucial to maintain a balance between innovation and responsibility. We must ensure that AI development benefits society as a whole while minimizing potential risks and negative impacts.

    Thank you for joining us on this journey through the world of artificial intelligence! We hope this overview has provided valuable insights into the current state and future potential of AI. Don't forget to subscribe for more in-depth discussions about specific AI topics and stay updated with the latest developments in this rapidly evolving field.
    """
    
    # Create output directory if it doesn't exist
    output_dir = "test_output"
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate audio
    output_path = os.path.join(output_dir, "test_output_long.wav")
    print("Generating audio from longer sample text...")
    success = text_to_speech(sample_text, output_path)
    
    if success:
        print(f"\nSuccess! Audio saved to: {output_path}")
        print("\nTest completed successfully. The audio should demonstrate:")
        print("1. Consistent voice across all chunks")
        print("2. Smooth transitions between segments")
        print("3. Natural pauses and intonation")
        print("4. Clear pronunciation of technical terms")
        print("5. Proper handling of punctuation")
        print("6. Effective handling of longer content")
        print("7. Natural flow between different sections")
        print("8. Proper emphasis on important points")
    else:
        print("\nError: Failed to generate audio")

if __name__ == "__main__":
    test_tts() 