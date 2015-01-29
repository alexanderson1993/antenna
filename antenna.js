antenna = new Meteor.Collection("antenna");

if (Meteor.isClient) {
  Template.antenna.rendered = function() {
    this.findAll('.slider').slider({
      tooltip: 'hide',
      handle: 'square',
      orientation: 'vertical',
      min: 0,
      max: 100,
      step: 1,
      value: 50
    });
  };

  stressLevel = function() {
    var currentAntenna = antenna.findOne({name: 'antenna1'});
    var idealTop = currentAntenna.idealTop;
    var idealBottom = currentAntenna.idealBottom;

    var currentTop = currentAntenna.currentTop;
    var currentBottom = currentAntenna.currentBottom;

    var topDiff = Math.abs(idealTop - currentTop);
    var bottomDiff = Math.abs(idealBottom - currentBottom);

    var stressLevel = topDiff + bottomDiff;
    if (stressLevel > 100){stressLevel = 100;}
    if (stressLevel < 0){stressLevel = 0;}

    return stressLevel;
  };

  Template.antenna.events = {
  'slide .slider': function (e, context) {
      var value = e.value;
      var target = e.target;
      if (target.id === "upperSlider"){antenna.update(antenna.findOne({name: 'antenna1'})._id, {$set: {currentTop: value}})}
      if (target.id === 'lowerSlider'){antenna.update(antenna.findOne({name: 'antenna1'})._id, {$set: {currentBottom: value}})}
    },
  'click #flux': function (e, context){
    antenna.update(antenna.findOne({name: 'antenna1'})._id, {$set: {idealTop: Math.floor(Math.random()*100), idealBottom: Math.floor(Math.random()*100)}});
  }
  };
   this.antennaObverver = antenna.find().observeChanges({
      added: function (id, doc) {
        $('#output').css('height', stressLevel()*2);
        $('#upperSlider').slider('setValue', doc.currentTop);
        $('#lowerSlider').slider('setValue', doc.currentBottom);
      },
      changed: function (id, doc) {
        $('#output').css('height', stressLevel()*2);
        $('#upperSlider').slider('setValue', doc.currentTop);
        $('#lowerSlider').slider('setValue', doc.currentBottom);
      },
    });
}

    


if (Meteor.isServer) {
  Meteor.startup(function () {
    if (antenna.find().count() === 0) {
        antenna.insert({name: 'antenna1', idealTop: 50, idealBottom: 50, currentTop: 50, currentBottom: 50});
  };
})
}