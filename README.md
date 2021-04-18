# Tough Life: Social Work (Gaming in p5.js)
# Project-2 - Jiaquan Wu
## 2021/Spring

### Desctibtion
This project is create a Social Justice game in p5.js. The main idea for this project is controlling an worker that just immigrant to this country. He find out this company has some kind of discrimnation to other people, and he need to solve those issue and finding a correct way to talk with them.

### Note
Except for the main.js and play.js system, this program using many different class (We call manager) to control the state change and interation to those NPC. It include:  
1. Advanture Manager (By Scott Kildall): It load up the basic map system and call other csv file to program interation.
2. Clickable Manager (By Scott Kildall): It load up all the clickable buttons include the X,Y and attribute.
3. Interation Manager (Directly used by Advanture Manager): Process differerent state and using different keyboard/mouse button to contol the flow of the state.
4. Context Manager(By myself): It load up the conversation detail by different state and group.
  
The rest of the program will using lots of sprite and animation, and them with used overlap function for interation goal.  

More detail notation is inside of the code.

### Website:
https://xarts.usfca.edu/~jwu85/Project-2/