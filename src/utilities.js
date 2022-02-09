// Define our labelmap

const labelMap = {
  1: { name: "Bruised broken wing (FP09)", color: "red" },
  2: { name: "Bruised broken leg (FP10)", color: "yellow" },
  3: { name: "Bruised breast (FP11)", color: "lime" },
  4: { name: "Bruised back (FP16)", color: "blue" },
  5: { name: "Bruised neck (FP22)", color: "purple" },
  6: { name: "Bruised elbow (FP32)", color: "brown" },
};

// const labelMap = {
//   1: { name: "Hello", color: "red" },
//   2: { name: "Thank You", color: "yellow" },
//   3: { name: "I Love You", color: "lime" },
//   4: { name: "Yes", color: "blue" },
//   5: { name: "No", color: "purple" },
// };

// const labelMap = {
//   1: { name: "Kangaroo", color: "red" },
//   2: { name: "Other", color: "yellow" },
// };

// Define a drawing function
export const drawRect = (
  boxes,
  classes,
  scores,
  threshold,
  imgWidth,
  imgHeight,
  ctx
) => {
  for (let i = 0; i <= boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      // Extract variables
      console.log(boxes[i]);
      console.log(classes[i]);
      console.log(scores[i]);

      const [y, x, height, width] = boxes[i];
      const text = classes[i];
      // console.log(text);

      // Set styling
      ctx.strokeStyle = labelMap[text]["color"];
      ctx.lineWidth = 10;
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";

      // DRAW!!
      ctx.beginPath();
      ctx.fillText(
        labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
        x * imgWidth,
        y * imgHeight - 10
      );
      ctx.rect(
        x * imgWidth,
        y * imgHeight,
        (width * imgWidth) / 2,
        (height * imgHeight) / 1.5
      );
      ctx.stroke();
    }
  }
};
