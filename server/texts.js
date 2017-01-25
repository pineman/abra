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
	"Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.",
	"An object in motion tends to remain in motion along a straight line unless acted upon by an outside force.",
	"Never let your sense of morals get in the way of doing what's right.",
	"The most exciting phrase to hear in science, the one that heralds new discoveries, is not 'Eureka!' but 'That's funny...'",
	"Some painters transform the sun into a yellow spot, others transform a yellow spot into the sun.",

	"You can't cling to the past, because no matter how tightly you hold on, it's already gone.",
	"Welcome to the real world. It sucks. You're gonna love it!",
	"I'm not so good with advice. Can I interest you in a sarcastic comment?",
	"If there's anything more important than my ego around, I want it caught and shot now.",
	"For a moment, nothing happened. Then, after a second or so, nothing continued to happen.",
	"This planet has - or rather had - a problem, which was this: most of the people living on it were unhappy for pretty much of the time. Many solutions were suggested for this problem, but most of these were largely concerned with the movement of small green pieces of paper, which was odd because on the whole it wasn't the small green pieces of paper that were unhappy.",
	"Anyone who is capable of getting themselves made President should on no account be allowed to do the job.", //Mr Trump?
	"The pen is mightier than the sword if the sword is very short, and the pen is very sharp.",
	"'It would seem that you have no useful skill or talent whatsoever,' he said. 'Have you thought of going into teaching?",
	"If you ignore the rules, people will, half the time, quietly rewrite them so they don't apply to you.",
	"Give a man a fire and he's warm for the day. But set fire to him and he's warm for the rest of his life.",
	"There are, it has been said, two types of people in the world. There are those who, when presented with a glass that is exactly half full, say: this glass is half full. And then there are those who say: this glass is half empty. The world belongs, however, to those who can look at the glass and say: What's up with this glass? Excuse me? Excuse me? This is my glass? I don't think so. My glass was full! And it was a bigger glass!",
	"Thunder rolled. It rolled a six.",
	"'You have to start out learning to believe the little lies.' 'So we can believe the big ones?' 'Yes. Justice. Duty. Mercy. That sort of thing.'",

	"Take the universe and grind it down to the finest powder, and sieve it through the finest sieve, and then show me one atom of justice, one molecule of mercy. And yet, you try to act as if there is some ideal order in the world. As if there is some, some rightness in the universe, by which it may be judged.",
	"Real stupidity beats artificial intelligence every time.",
	"The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it.",

	"SYSCALL_DEFINE1(brk, unsigned long, brk)",

	"Never gonna give you up, never gonna let you down, never gonna run around and desert you",
	"What is love? Baby don't hurt me. Don't hurt me. No more.",
	"And I say HEEEEEYEEEEEYEEEEEYEEEEEEAH! HEEEEEYEEEEEYEAH! I say HEY! What's going on?",
	"You rise, you fall, you're down then you rise again. What don't kill you make you more strong",

	"A man, a plan, a canal - Panama!",
	"A man, a plan, a cat, a canal - Panama!",
	"A man, a plan, a cam, a yak, a yam, a canal - Panama!",
	"A man, a plan, a cat, a ham, a yak, a yam, a hat, a canal - Panama!"

    "What you guys are referring to as Linux, is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux."
];

// Select a random text
function getText() {
	let rand = Math.floor(Math.random() * texts.length);
	return texts[rand];
}

module.exports.texts = texts;
module.exports.getText = getText;
