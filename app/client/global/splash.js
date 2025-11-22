class qbsplash extends HTMLElement {
  static observedAttributes = ["color", "size"];
  
  constructor() {
    super();
  }
  
  connectedCallback() {
    var imgsrc = $(this).attr("imgsrc");
    var tips = [
      "Clatter was created because of Hack Club's High Seas YSWS!",
      "Clatter is open source!",
      "Clatter is a open-source alternative to Slack and Cliq!"
    ];
    var tip = tips[Math.floor(Math.random() * tips.length)];

    $(this).attr('style', 'background-color: white; display: flex; width: 100vw; height: 100vh; position: fixed; z-index: 6000; opacity: 1; flex-direction: column; color: #666666; justify-content: center; align-items: center; text-align: center; gap: 0;')
    $(this).html(`
      <img style="height: 5rem; width: 5rem;" src="${imgsrc}">
      <h3 style="text-transform: uppercase; font-size: 1rem; font-weight: 600; margin-top: 3rem; margin-bottom: 0;">Did you know?</h3>
      <p style="font-weight: normal; margin-top: 1.25rem; font-size: 1.15rem;">${tip}</p>
    `);
    
    if ($(this).attr("fadein") == "true") {
      $(this).css('opacity', 0.01);
      $(this).animate({
      opacity: 1
      }, 500);
    } else if ($(this).attr("awr") != "true") {
      setTimeout(() => {
      $(this).animate({
        opacity: 0
      }, 300, function(){
        $(this).remove();
      });
      }, 1000 + 500);
    }
  }
}
  
customElements.define("beacon-splash", qbsplash);

var fadeoutsplash = function() {
  setTimeout(() => {
  $("beacon-splash").animate({
    opacity: 0
  }, 500, function(){
    $(this).remove();
  });
  }, 500);
}