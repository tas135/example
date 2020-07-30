  DROP SEQUENCE IF EXISTS Session_seq;
  DROP SEQUENCE IF EXISTS Bug_seq;
  DROP SEQUENCE IF EXISTS User_seq;
  CREATE SEQUENCE IF NOT EXISTS Session_seq;
  CREATE SEQUENCE IF NOT EXISTS Bug_seq;
  CREATE SEQUENCE IF NOT EXISTS User_seq;

  /** Create Tables **/
  CREATE TABLE IF NOT EXISTS Sessions(
    SessionID INT PRIMARY KEY DEFAULT nextval('Session_seq'),
    SessionName STRING UNIQUE NOT NULL,
    Location STRING,
    DateTime STRING NOT NULL,
    ActiveStatus BOOL DEFAULT TRUE,
    LiveStatus BOOL DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS Users(
    UserID INT UNIQUE DEFAULT nextval('User_seq'),
    Nickname STRING NOT NULL,
    SessionID INT NOT NULL REFERENCES Sessions(SessionID),
    PRIMARY KEY (Nickname,SessionID)
  );

  CREATE TABLE IF NOT EXISTS Bugs (
    BugID INT PRIMARY KEY DEFAULT nextval('Bug_seq'),
    BugName STRING UNIQUE NOT NULL,
    ImagePath STRING UNIQUE NOT NULL,
    Bio STRING NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Ratings(
    UserID INT REFERENCES Users(UserID) ON DELETE CASCADE,
    BugID INT REFERENCES Bugs(BugID),
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    PRIMARY KEY (UserID,BugID)
  );

  /* Prepopulate Entries in Bug Table */

  INSERT INTO bugs (bugname,imagepath,bio) 
  VALUES
    ('Ant','../../../assets/BugImages/Ant.jpeg','Ants communicate using chemicals sensed by their antennae.'),
    ('Beetle','../../../assets/BugImages/Beetle.jpeg','Beetles only live for a year.'),
    ('Butterfly','../../../assets/BugImages/Butterfly.jpeg','Butterflies taste with their feet.'),
    ('Caterpillar','../../../assets/BugImages/Caterpillar.jpeg','Caterpillars have 12 eyes.'),
    ('Fly','../../../assets/BugImages/Fly.jpeg','Flies have no teeth.'),
    ('Grasshopper','../../../assets/BugImages/Grasshopper.jpeg','Grasshoppers can jump 25cm high and 1m long.'),
    ('Ladybird','../../../assets/BugImages/Ladybird.jpeg','Ladybirds have two sets of wings.'),
    ('Mosquito','../../../assets/BugImages/Mosquito.jpeg','Only female mosquitos bite.'),
    ('Spider','../../../assets/BugImages/Spider.jpeg','Spiders have 8 legs.'),
    ('Wasp','../../../assets/BugImages/Wasp.jpeg','Wasps cannot be found in Antarctica.'),
    ('Barry B. Benson','../../../assets/BugImages/bee.png','A recent graduate of bee college, Barry sues humanity for selling honey and wins. He then realises his mistake and attempts to rectify his actions.'),
    ('Flea','../../../assets/BugImages/flea.jpg','Fleas do not have ears and are virtually blind. They can jump 30,000 times without stopping.'),
    ('Dragonfly','../../../assets/BugImages/dragonfly.jpeg','Dragonflies have two sets of wings and have been around for 300 million years.'),
    ('Cricket','../../../assets/BugImages/cricket.jpg','The intensity of cricket chirps depends on the temperature; the hotter it is the more frequent the chirps.'),
    ('Centipede','../../../assets/BugImages/centipede.png','As centipedes age, they grow more legs and are able to regrow their limbs. They may also bite people in self defence.'),
    ('Firefly','../../../assets/BugImages/firefly.jpg','Fireflies are bioluminescent, which means they can produce their own light, and their light shows are mating acts.'),
    ('Cockroach','../../../assets/BugImages/cockroach.png','A cockroach can live for a week without its head since they have an open circulatory system, and do not depend on the mouth or head to breathe.'),
    ('Worm','../../../assets/BugImages/worm.jpg','A worm has no arms, legs or eyes.'),
    ('Millenium Bug','../../../assets/BugImages/millenium.jpg','A software bug that was anticipated to cause issues at the turn of the century.'),
    ('Woodlouse','../../../assets/BugImages/woodlouse.jpg','Woodlice are more related to crabs than insects and are able to store high concentrations of metals without being poisoned.'),
    ('Bugzilla','../../../assets/BugImages/bugzilla.jpg','A web-based bug tracking tool used in Mozilla Project'),
    ('Insectosaurus','../../../assets/BugImages/insecto.png','A character in Monsters vs Aliens that can shoot sticky web substance from her nostril to attack monsters.'),
    ('Gromflomites','../../../assets/BugImages/grom.jpg','An insect humanoid that appears in Rick and Morty acting as security guards for inter-dimensional customs.'),
    ('Ticks','../../../assets/BugImages/tick.jpg','Ticks are mini, real-life vampires. They require blood meal to survive such as mice and human.'),
    ('Camel Spider','../../../assets/BugImages/camelspider.jpg','Myth says this creature kills camels to enter their stomach and lay its eggs inside, thus its name. Of course, this is false. The reason behind the name is simply because they are found in the desert.'),
    ('Cicakman (Geckoman)','../../../assets/BugImages/cicakman.jpg',' A Malaysian comedy superhero film. He accidentally drinks coffee that has been contaminated by a virus-infected gecko and got its power.'),
    ('Antman','../../../assets/BugImages/antman.jpg','Ant-Man has the power to shrink himself and other people and objects along with himself to the size of an ant. Fancy being small? Find me.'),
    ('Spiderman','../../../assets/BugImages/spiderman.png','Why Spiderman does not have a data plan for his phone? Because he is always connected to the web.'),
    ('Horsefly','../../../assets/BugImages/horsefly.jpg','Horsefly are only active in sunlight, avoiding dark and shady areas.'),
    ('Goliath Birdeater','../../../assets/BugImages/goliath.jpg',' Imagine a spider as big as a child''s forearm that weighs as much as a puppy. The South American Goliath birdeater is that huge'),
    ('Flik','../../../assets/BugImages/flik.png','Flik is inventive. He wraps a blade of grass around a drop of dew to create a telescope.'),
    ('Absolem the Caterpillar','../../../assets/BugImages/alice-caterpillar.jpg','A blue caterpillar who smokes a hookah pipe when Alice meets him.'),    
    ('Jiminy Cricket','../../../assets/BugImages/jiminy.png',' Jiminy was used as a host in many Disney televsion shows often singing his classic “When You Wish Upon a Star.'),
    ('Bugs Bunny','../../../assets/BugImages/bugbunny.png','I am a bunny not a bug.'),
    ('Common Cold','../../../assets/BugImages/cold.png','A cold is a mild viral infection of the nose, throat, sinuses and upper airways. The main symptoms include a sore throat, a blocked/runny nose, sneezing, and a cough.'),
    ('Filbert Weevil','../../../assets/BugImages/weevil.jpg','The Filbert Weevil is native to the western side of North America and can be found living in Oak Trees. These weevils are considered a pest due to the damage they cause to acorns. '),
    ('Hickory Horned Devil','../../../assets/BugImages/devil.jpg','The hickory horned devil is a nocturnal caterpillar. They resemble bird droppings and during the day, they curl up into a “j” shape.'),
    ('Flower Mantis','../../../assets/BugImages/mantis.jpg','Flower mantises are those species of praying mantis that mimic flowers. Their coloration is an example of aggressive mimicry, a form of camouflage used to lure prey.'),
    ('Baby Shark','../../../assets/BugImages/shark.jpg','Not a bug. Very annoying.'),
    ('Jewel Beetle','../../../assets/BugImages/jewel.jpg','Jewel beetles live in forests and woodlands, heath. Many are found in the Sydney region and can be seen feeding on and flying around flowers in heaths and woodlands. The larvae live in wood or, more rarely, softer plant stems, with some species feeding in dry leaves.'),
    ('Picasso Bug','../../../assets/BugImages/picasso.jpg','Since the shell that covers their wings is in one piece, Picasso Bugs are rather reluctant to fly, but can and do fly very well. When threatened the Picasso bug can let off a vile smelling substance, the bug itself is also poisonous to eat.'),
    ('Moth','../../../assets/BugImages/moth.jpg','Although they lack noses, moths can smell females more than 7 miles away. They use their antennae instead of nostrils.'),
    ('Earwig','../../../assets/BugImages/earwig.jpg','Contrary to the myth, earwigs will not attempt to enter your ears and feed on your brain. They are omnivores, and although earwigs have wings, they rarely make use of them. ');


    

