import sys
from paddleocr import PaddleOCR

ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    lang="en"
)

image_path = sys.argv[1]

result = ocr.predict(image_path)

texts = []

for page in result:
    for item in page["rec_texts"]:
        texts.append(item)

print("\n".join(texts))