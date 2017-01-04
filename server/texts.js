texts = [
	"The quick brown fox jumps over the lazy dog.",
	"Grumpy wizards make toxic brew for the evil queen and jack.",
	"Oak is strong and also gives shade.",
	"Cats and dogs each hate the other.",
	"The pipe began to rust while new.",
	"Open the crate but don't break the glass.",
	"Add the sum to the product of these three.",
	"Thieves who rob friends deserve jail.",
	"The ripe taste of cheese improves with age.",
	"Act on these orders with great speed.",
	"The hog crawled under the high fence.",
	"Move the vat over the hot fire.",

	"The sky above the port was the color of television, tuned to a dead channel.",
	"He who controls the past controls the future. He who controls the present controls the past.",

	"Whoever fights monsters should see to it that in the process he does not become a monster.",
	"He who has a why to live can bear almost any how.",
	"Anywhere can be paradise as long as you have the will to live.",
	"This convenient fabrication is your attempt to change reality.",
	"You can't bridge the gap between your own truth and the reality of others.",
	"In order to determine whether we can know anything with certainty, we first have to doubt everything we know.",
	"I think, therefore I am.",

	"You can't cling to the past, because no matter how tightly you hold on, it's already gone.",
	"Welcome to the real world. It sucks. You're gonna love it!",
	"I'm not so good with advice. Can I interest you in a sarcastic comment?",

	"SYSCALL_DEFINE1(brk, unsigned long, brk)"
];

// Select a random text
function getText() {
	let rand = Math.floor(Math.random() * texts.length);
	return texts[rand];
}

module.exports.texts = texts;
module.exports.getText = getText;
