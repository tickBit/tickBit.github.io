<!DOCTYPE html>
<html lang="fi">
  <head>
    <meta charset="utf-8">
    <title>Puhe</title>
    <style>
      
      .activate {
        background-color: rgba(112, 148, 245, 0.25);
        margin: auto;
        text-align: center;
        padding: 2em;
        width: 8em;
        height: 4em;
        transition: 0.2s;
        margin-bottom: 2em;
        animation: blinker 1s linear infinite;
        animation-play-state: paused;
      }


      @keyframes blinker {
        50% {
        background-color: rgb(152, 152, 252);
        }
      }

      .activate:hover {
        box-shadow: 0 0 10px #2196f3, 0 0 40px #2196f3, 0 0 80px #2196f3;
      }
      .puhe {
        background-color: rgba(245, 225, 112, 0.25);
        margin: auto;
        text-align: center;
        padding: 2em;
        width: 8em;
        height: 5em;

      }
      #voice2text {       
        margin: auto;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="activate">
        <p id="pactivate">Activate voice</p>
    </div>
        
    <div class="puhe">
      <P>Sanoit / You said:</P>
      <p id="voice2text"></p>
    </div>

    <script src="speechtotext.js"></script>


  </body>
</html>
