const birds = [
  {
    id: 3232,
    name: "Viherpeippo",
    hasShown: false,
  },
  {
    id: 3432,
    name: "Varpunen",
    hasShown: false,
  },
  {
    id: 9832,
    name: "Isokoskelo",
    hasShown: false,
  },
  {
    id: 7652,
    name: "Pulu",
    hasShown: false,
  },
  {
    id: 12432,
    name: "Tikli",
    hasShown: false,
  },
];

// Get birds that haven't been shown to the user yet
const getRamainingBirds = (birds) => birds.filter((bird) => !bird.hasShown);
// Get random bird from array that hasn't been shown to user.
const getRandomBird = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Get data
const remainingBirds = getRamainingBirds(birds);
let randomBird = getRandomBird(remainingBirds).name;
let finished = false;

const showStatus = (remainingBirds) => {
  const wordNum = document.querySelector("#wordNum");
  const delta = birds.length - remainingBirds.length;
  return wordNum.innerHTML = `${delta + 1} / ${birds.length}`

}
// Word to array of objects in order to add active status and control the direction
const wordToArray = (randomBird, isDirectionLeft = true) => {
  return randomBird.split("").reduce(
    (total, current, index) => [
      ...total,
      {
        letter: current,
        isActive:
          isDirectionLeft && index === 0
            ? true
            : !isDirectionLeft && index === randomBird.length - 1
            ? true
            : false,
      },
    ],
    []
  );
};

// load the word
const renderWord = (currentWordArray) => {
  const container = document.querySelector(".word");
  return (container.innerHTML = currentWordArray
    .map(
      (letter) =>
        `<span class="${letter.isActive ? "active" : ""}">${
          letter.letter
        }</span>`
    )
    .join(""));
};

// Remove the pressed letter and update direction
const removeAndSetDirection = (wordArray, userLetter) => {

    // Active index should be either '0' or 'array.length - 1'
    const activeIndex = wordArray.findIndex(letter => letter.isActive)
    const filtered =  wordArray.filter(letter => letter.letter.toLowerCase() !== userLetter.toLowerCase())

    // Set active and return new array
    return filtered.reduce((total, current, index) => [...total, {letter: current.letter, isActive: activeIndex === 0 && index === filtered.length - 1 ? true : activeIndex !== 0 && index === 0 ? true : false}], [])
    
}

// Update the main array to show next word to user.
const updateRemainingBirds = (completedWord) => {
    const birdsClone = [...remainingBirds]
    const index = birdsClone.findIndex(bird => bird.name === completedWord);
    const birdObject = birdsClone[index]
    birdObject.hasShown = true;
    birdsClone[index] = birdObject
    return birdsClone
}
// Show the finished text
const finish = () => {
    const container = document.querySelector(".word");
    container.style.flexDirection = "column"
    const p = document.createElement("p")
    p.textContent = "Great! names finished :)"
    p.className = "finished-text"
    const button = document.createElement("button")
    button.className = "button"
    button.innerText = "Restart"
    container.appendChild(p)
    container.appendChild(button)
    button.addEventListener("click", () => location.reload())

}
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

const init = () => {
    // init data
  let currentWordArray = wordToArray(randomBird);
  renderWord(currentWordArray);
  // Update status
  showStatus(remainingBirds)

  document.addEventListener("keydown", (e) => {
    const userLetter = e.key;
    const activeLetter = currentWordArray?.filter((letter) => letter.isActive)[0]?.letter;

    // If user presses the right key
    if(userLetter.toLowerCase() === activeLetter?.toLowerCase() && !finished){
        const filteredWord = removeAndSetDirection(currentWordArray, userLetter)
        currentWordArray = filteredWord;
        renderWord(filteredWord);


        // If word letters removed, go to next word
        if(filteredWord.length < 1){
        
            // Show next word
            const updatedRemainingBirds = updateRemainingBirds(randomBird)
            const remainingBirds = getRamainingBirds(updatedRemainingBirds)
            if(remainingBirds.length < 1){
                finished = true;
                return finish()
            }
            const newRandomBird = getRandomBird(remainingBirds).name;
            let newCurrentWordArray = wordToArray(newRandomBird);
            randomBird = newRandomBird;
            currentWordArray = newCurrentWordArray;
            // Update status
            showStatus(remainingBirds)
            renderWord(newCurrentWordArray);
            return Toast.fire({
                icon: 'success',
                title: "Great, next word"
            })
        }
    }else{
      if(finished){
        return Toast.fire({
          icon: 'info',
          title: "Game has finished."
      })
    }
      Toast.fire({
        icon: 'info',
        title: "Wrong letter, try again"
    })
    }
  });
};
init();
