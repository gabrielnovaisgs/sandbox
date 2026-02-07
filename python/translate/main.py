from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_id = "Helsinki-NLP/opus-mt-tc-big-en-pt"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

#text = "Learning Python is fun!"
#
#input_tokens = tokenizer(text, return_tensors="pt")
#response_tokens = model.generate(input_tokens['input_ids'])
#translated = tokenizer.decode(response_tokens[0], skip_special_tokens=True)
#print(translated)