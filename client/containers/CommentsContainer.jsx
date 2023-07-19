import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HelperFunctions from '../helper-functions';
import '../styles/Comments.scss';

import { Navbar } from '../components/Navbar.jsx';
import { CommentHeader } from '../components/CommentHeader.jsx';
import { CommentBox } from '../components/CommentBox.jsx';
import { CommentPostOverlay } from '../components/CommentPostOverlay.jsx';


export const CommentsContainer = ({ data }) => {
  //this is the state for the accordian, when the accordian is clicked it invokes an active index
  const [activeIndex, setActiveIndex] = useState(null);

  //state overlay that is changed to true when the button is clicked in order to appear
  const [showOverlay, setShowOverlay] = useState(false);

  //here are the states for the form to keep track of each input
  const [editorContent, setEditorContent] = useState('');
  const initialVal = ` - Technical notes / Key insights`;
  const [techName, setTechName] = useState('');
  const [techLink, setTechLink] = useState('');
  const [techDescription, setTechDescription] = useState('');
  const [techImage, setTechImage] = useState('');
  const [entry, setEntry] = useState();
  const [image, setImage] = useState();

  //from here we had starting typing out the states to handle the backend format but realized we did not have enough time so it is not connected/finished
  /*
      CREATE TABLE posts(
        post_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        tech INTEGER NOT NULL,
        FOREIGN KEY(tech) REFERENCES techs(tech_id),
        uploader INTEGER NOT NULL,
        FOREIGN KEY(uploader) REFERENCES users(user_id),
        type_review BOOLEAN,
        type_advice BOOLEAN,
        type_code_snippet BOOLEAN,
        type_help_offer BOOLEAN,
        language INTEGER NOT NULL,
        FOREIGN KEY(language) REFERENCES languages (language_id),
        comment VARCHAR(5000) NOT NULL,
        image TEXT
    )
  */

  // title TEXT NOT NULL,
  const [titleEntry, setTitleEntry] = useState();

  // tech INTEGER NOT NULL,
  const [currentTech, setCurrentTech] = useState();
  // uploader INTEGER NOT NULL,

  // type_review BOOLEAN,

  // type_code_snippet BOOLEAN,

  // type_advice BOOLEAN,

  // type_help_offer BOOLEAN,

  // comment VARCHAR(5000) NOT NULL,

  // language INTEGER NOT NULL,
  const [languageEntry, setLanguageEntry] = useState();
  const [commentEntries, setCommentEntries] = useState([]);

  //to find id of our url
  const { id } = useParams();

  const addComment = async () => {
    event.preventDefault();
    console.log(id, titleEntry, entry, image);
    try {
      setShowOverlay(false);
      //on the button click the overlay is set back to false
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          // userId: number, found via backend

          tech_id: id,
          typeReview: false,
          typeAdvice: false,
          typeCodeSnippet: false,
          typeHelpOffer: false,
          languageid: 1,
          title: titleEntry,
          comment: entry,
          image: image,
        }),
      });

      const data = await response.json();
      console.log('success');
      console.log('data returned', data);
    } catch (err) {
      console.log(err);
    }
  };

  // initializing the page
  useEffect(() => {
    //the tech id is linked to the home page box technology clicked
    const techId = id;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/tech/' + techId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const newData = JSON.parse(JSON.stringify(data));
        // newData =  {tech: tech-obj, posts: [post-obj, post-obj, ..]}
        setCommentEntries(newData.posts);
        setCurrentTech(newData.tech);
        setTechName(newData.tech.name);
        setTechDescription(newData.tech.description);
        setTechLink(newData.tech.link);
        setTechImage(newData.tech.image_url);
        console.log(newData);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const openOverlay = (e) => {
    // e.preventDefault();
    if (showOverlay) {
      setShowOverlay(null);
    }
    else {
      const postCommentOverlay = <CommentPostOverlay
        titleEntry={titleEntry}
        setTitleEntry={setTitleEntry}
        languageEntry={languageEntry}
        setLanguageEntry={setLanguageEntry}
        initialVal={initialVal}
        handleEditorChange={handleEditorChange}
        entry={entry}
        setEntry={setEntry}
        image={image}
        setImage={setImage}
        addComment={addComment}
      />
      setShowOverlay(postCommentOverlay);
    }
  };

  const handleAccordionClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };

  const comments = data.map((item, index) => {
    return <CommentBox 
      item={item}
      index={index} 
      activeIndex={activeIndex}
      handleAccordionClick={handleAccordionClick}
      HelperFunctions={HelperFunctions}
    />
  });

  return (
    <div>
      <Navbar />

      <CommentHeader 
        techImage={techImage}
        techLink={techLink}
        techName={techName}
        techDescription={techDescription}
        openOverlay={openOverlay}
      />

      {showOverlay}

      <div className="input-container">
        <input type="text" className="input-bar" placeholder="Search APIs..." />
      </div>

      <div className="accordion">{
        comments}
      </div>
    </div>
  );
};