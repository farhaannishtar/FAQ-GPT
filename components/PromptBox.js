import Head from "next/head";
import { useState } from "react";
import styles from "./promptBox.module.css";

function PromptBox() {
  const [topicInput, setTopicInput] = useState("");
  const [result, setResult] = useState();

  const [FAQs, setFAQs] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topicInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);

      processResponse(data.result);

      setTopicInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function processResponse(result) {
    const faqString = result.trim();
    const faqArray = faqString.split("Q: ").slice(1);
    const faqObject = {};

    for (let i = 0; i < faqArray.length; i++) {
      const currentFAQ = faqArray[i].split("A: ");
      const question = currentFAQ[0].trim();
      const answer = currentFAQ[1].trim();
      faqObject[question] = answer;
    }

    console.log(faqObject);
    for (let key in faqObject) {
      console.log(key, faqObject[key]);
    }
  }

  return (
    <div>
      <Head>
        <title>FAQ Generator</title>
      </Head>

      <main className={styles.main}>
        <h3>Store Sets of Chat GPT Generated FAQs for a Topic in Notion</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="topic"
            placeholder="Enter a Topic"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <input type="submit" value="Generate Frequently Asked Questions" />
        </form>
        <div className={styles.result}>{result}</div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="topic"
            placeholder="Enter Notion Email"
            value={"Enter Notion Email"}
            onChange={(e) => setTopicInput()}
          />
          <input type="submit" value="Save to Notion" />
        </form>
      </main>
    </div>
  );
}

export default PromptBox;
