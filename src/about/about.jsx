import React from 'react';
import "./about.css"

export function About() {
  return (
    <main>
        <div>
            <br />
            <h2>Horray for The Name Game Application!</h2>
            <div className="description-box">
                <p>Have you ever played the Name Game? It is a party game that is fun for groups of all sizes and ages. Everyone writes down a word from a
                certain theme and gives it to the person in charge. This person will then read off the words. The goal of the game is to remember each word and figure out who put down which word! Normally there is someone who moniters the game and can't play but those days are long gone with this new application! Now everyone can play and there isn't even a need to get paper out! So get with your friends, hop on, and enjoy a evening full of laughter and fun!</p>
                <img src="public/DisguisedMan.png" alt="Disguised Man"></img>
            </div>
        </div>
    </main>
  );
}