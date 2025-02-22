class qbsplash extends HTMLElement {
    static observedAttributes = ["color", "size"];
  
    constructor() {
      super();
    }
  
    connectedCallback() {
        var imgsrc = $(this).attr("imgsrc")
        if ($(this).attr("fadein") == "true") {
          $(this).attr('style', 'background-color: white; display: flex; width: 100vw; height: 100vh; position: fixed; z-index: 8000; opacity: 0.01;')
          $(this).animate({
            opacity: 1
          }, 300,)
        } else if ($(this).attr("awr") != "true") {
          $(this).attr('style', 'background-color: white; display: flex; width: 100vw; height: 100vh; position: fixed; z-index: 6000;')
          setTimeout(() => {
            $(this).animate({
              opacity: 0
            }, 300, function(){
              $(this).remove()
            })
          }, 1000);
        } else (
          $(this).attr('style', 'background-color: white; display: flex; width: 100vw; height: 100vh; position: fixed; z-index: 6000;')
        )
        $(this).html('<img style="height: 80px; width: 80px; align-self: center; margin-left: auto; margin-right: auto;" src="' + imgsrc + '"></img>')
    }
  
}
  
customElements.define("beacon-splash", qbsplash);

var fadeoutsplash = function() {
  $("beacon-splash").animate({
    opacity: 0
  }, 300, function(){
    $(this).remove()
  })
}