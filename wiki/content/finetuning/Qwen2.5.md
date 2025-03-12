# Qwen 2.5 finetuning efforts

## Methods tried :

- Qlora
- GRPO
  - only 1000 steps due to computing limitations

> [!NOTE] both Through unsloth due to efficiency/performance gains given the limited compute resources

## Datasets tried :

- [Amod/mental_health_counseling_conversations](https://huggingface.co/datasets/Amod/mental_health_counseling_conversations)
- [Gragroo/therapist-sft-finetome-formatted](https://huggingface.co/datasets/Gragroo/therapist-sft-finetome-formatted)

## Challenges faced / Solutions I came up with :

### Challenge 1

- faced issues with over-fitting even when training was less than 1 epoch when I trained with the `Amod/mental_health_counseling_conversations` dataset furthermore there was no way to monitor the training process accurately / nicely with relevant information.

### what I did to overcome challenge 1

- found a bigger dataset called `Gragroo/therapist-sft-finetome-formatted`, I also opened a student account with wandb to monitor my model's training live and create checkpoints to rollback to and configured it to work with my training data.

### challenge 2

- Model always assumes my user's name is charlie and responses weren't as thoughtful.

### what i did to overcome challenge 2

- Tried to train the model with GRPO with a reward function which greatly enhanced the model's efficacy and accuracy and the answer's were thoughtful to the user's situation

### challenge 3

- model does not have data on what Psychiatrist's use to study / regulations and standard practices for Psychiatrists based on region.

### what i did to overcome challenge 3

- implemented a RAG chain with a built up vector store with relevant documents and updated the system prompt accordingly

### challenge 4

## Methods that are yet to be tried :

- full parameter fine-tuning
  - could not be done due to constraint on computing resources
- a full epoch for GRPO to see if model trains without overfitting and if results are better for a full train.
  - could not be done due to lack of computing resources.

## Conclusion

in conclusion, Qwen 2.5 reacted quite well to Qlora fine fine-tuning and works quite well especially after GRPO fine fine-tuning, but there are some distinct issues that still needs some trial with more computing resources to see if the solutions are feasible. The model also boasts string bilingual capabilities which is something that can be looked positively at for future developments.
