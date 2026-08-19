---
layout: post
title: AEV Project
subtitle: ELECENG 3EY4
thumbnail-img: assets/img/ev-project/McMaster_AEV.png
share-img: assets/img/ev-project/McMaster_AEV.png
tags: [engineering]
author: Tina Ismail
---
This project required me to develop and integrate **software and hardware modules** for the McMaster Autonomous Electrified Vehicle AEV, which is built on a small-scale **(1/10th) RC vehicle** platform.  
The goal is to develop sensing, planning, and #control modules that allow the vehicle to operate in a range of scenarios from **manual driving**, through manual driving with **driver-assist**, to fully **autonomous driving**. 

The course used some of the material and existing software stack from the [**F1TENTH**](https://f1tenth.org/) project. 	

The first few weeks of the course focused on the electric propulsion system of the vehicle, exploring topics in modeling and control of electric motor drives. The second part concentrated on autonomous driving aspects of the vehicle, where I explored strategies for manual driving with collision avoidance assistance, as well as fully autonomous driving. Moreover, the concept of localization and mapping (SLAM) in autonomous systems was covered. 

Throughout the course I gained practical skills in Linux OS, C/C++, Python, the Robot Operating System (ROS), and Matlab Simulink. I used **VESC** (shown below) for operating the motor and Jetson Nano microcontroller.
![](assets/img/ev-project/VESC.png)

The AEV has a Camera sensor, Jetson Nano microcontroller (?), LIDAR sensor, and [[VESC]].

![](assets/img/ev-project/McMaster_AEV.png)
## Chassis and VESC
The original chassis contains a servomotor and a brushless DC motor. VESC provides sensor less FOC to drive the motor as well as PPM for the servo.
![](assets/img/ev-project/chassis.png)
## [[Brushless DC Motor]]
- PMSM with surface mounted magnets
- 3 phase motor where speed is proportional to the input frequency
- controlled using a 3 phase inverter with Field Oriented Controller

This specimen is designed for RC car applications
- 3200 kV (if 1 V is applied, the motor rotates at 3200 RPM)
- 4 poles
![](assets/img/ev-project/brushless_motor.png)


This is a deep dive into the motor construction.

## Objective
- Reverse-engineer the motor by disassembling it and observe the motor geometry
- Measure the flux linkage of the motor with the no-load rotation test
- Create a finite element model of the motor
- Simulate the magnetic flux linkage, as well as torque generation with finite model analysis
- Compare the simulation results with with experimental results as well as theoretical calculations

### Motor disassembly
![[Pasted image 20240223000013.png]]
![[Pasted image 20240223000033.png]]
### Open circuit test
- Measurement of induced voltage while rotating the motor under open circuit
- Induced voltage (Back-EMF) is directly proportional to the rotational speed of the rotor
- Magnet flux linkage determine how much torque can be generated with a specific current, and how fast the motor can spin given a voltage
![[Pasted image 20240223001316.png]]
![[Pasted image 20240223001646.png]]
- Relation between back-EMF and flux linkage: $$(\lambda_{PM}=\frac{BEMF}{\omega_e})$$
