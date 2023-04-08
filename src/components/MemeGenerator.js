import React, { useState, useEffect } from "react";

const MemeGenerator = () => {
  const [templateId, setTemplateId] = useState(null);
  const [texts, setTexts] = useState([]);
  const [memeUrl, setMemeUrl] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(data => setTemplates(data.data.memes))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = event => {
    event.preventDefault();

    //Checks for text in at least one input and sets state accordingly
    if (texts.every(text => text.trim() === "")) {
      setFormError(true);
      return;
    } else {
      setFormError(false);
    }

    const boxesParams = texts.map((text, index) => `boxes[${index}][text]=${encodeURIComponent(text)}`).join("&");
    fetch(`https://api.imgflip.com/caption_image?template_id=${templateId}&username=${process.env.REACT_APP_IMGFLIP_USERNAME}&password=${process.env.REACT_APP_IMGFLIP_PASSWORD}&${boxesParams}`)
      .then(response => response.json())
      .then(data => setMemeUrl(data.data.url))
      .catch(error => console.log(error));
  };

  
/*sets the templateId state variable and initializes texts state variable with array 
of empty strings with length equal to box_count property of the selected template*/

  const handleTemplateChange = event => {
    setTemplateId(event.target.value);
    const selectedTemplate = templates.find(template => template.id === event.target.value);
    setTexts(new Array(selectedTemplate.box_count).fill(""));
  };

  const handleTextChange = (index, event) => {
    const newValues = [...texts];
    newValues[index] = event.target.value;
    setTexts(newValues);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="template" className="label">Choose a template:</label>
        <select id="template" className="select" onChange={handleTemplateChange}>
          <option value="">Select a template</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
        <br />
        {texts.map((text, index) => (
          <div key={index}>
            <label htmlFor={`text${index}`} className="label">Text {index + 1}:</label>
            <input id={`text${index}`} type="text" className="input" value={text} onChange={event => handleTextChange(index, event)} />
            <br />
          </div>
        ))}

        {formError && <p className="error">Please enter text in at least one input field.</p>}
        <button type="submit" className="button">Generate Meme</button>
      </form>
      {memeUrl && <img src={memeUrl} alt="Generated Meme" className="meme" />}
    </div>
  );
};

export default MemeGenerator;