let gui;

window.onload =  () =>
{
    let animationSpeedR = 0.08;
    let animationSpeedM = 0.015;

    // GUI
    var robotControllVars = function() {
        this.yellowX = 0;
        this.yellowY = 6.5;
        this.yellowZ = 0;
        this.orangeX = 0;
        this.orangeY = 0;
        this.orangeZ = -90;
        this.animation = animate;
      };
      
    var robotVars = new robotControllVars();
    var gui = new dat.GUI();
    gui.add(robotVars, 'yellowX', -7, 7).listen();
    gui.add(robotVars, 'yellowY', 0, 13).listen();
    gui.add(robotVars, 'yellowZ', -35, 35).listen();
    gui.add(robotVars, 'orangeX', -90, 90).listen();
    gui.add(robotVars, 'orangeY', -180, 180).listen();
    gui.add(robotVars, 'orangeZ', -220, 40).listen();
    gui.add(robotVars, 'animation');

    // Setup
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
    camera.position.z = 30;

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.querySelector('#container').appendChild( renderer.domElement );
    // Controls
    var orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = true;
    // Lights
    var lights = [];
    lights[ 0 ] = new THREE.DirectionalLight( 0xffffff );
    lights[ 1 ] = new THREE.SpotLight( 0xffffff);
    lights[0].castshadow = true;

    lights[0].shadow.mapSize.width = 512;  // default
    lights[0].shadow.mapSize.height = 512; // default
    lights[0].shadow.camera.near = 0.5;       // default
    lights[0].shadow.camera.far = 50000;      // default

    lights[ 0 ].position.set( -100, -100, 0 );
    lights[ 1 ].position.set( 100, 100, 100 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );

    // Shapes
    // ground
    var groundGeo = new THREE.BoxGeometry( 100, 1, 100 );
    var groundMaterial = new THREE.MeshLambertMaterial( {color: 0x8f939b} );
    var ground = new THREE.Mesh( groundGeo, groundMaterial );

    ground.receiveShadow = true; //default

    ground.position.set(0,-20,0);
    scene.add( ground );

    // Yellow robot
    var legGeometry = new THREE.CylinderGeometry( 1, 1, 20, 10 );
    var YellowRobotMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
    var GreyRobotMaterial = new THREE.MeshLambertMaterial( {color: 0x635334} );

    // legs
    var groupYellowRobot = new THREE.Group();
    var leg1 = new THREE.Mesh( legGeometry, YellowRobotMaterial );
    leg1.position.set(-40,-10,-40);
    groupYellowRobot.add( leg1 );
    leg1.castShadow = true;

    var leg2 = new THREE.Mesh( legGeometry, YellowRobotMaterial );
    leg2.position.set(-20,-10,-40);
    groupYellowRobot.add( leg2 );

    var leg3 = new THREE.Mesh( legGeometry, YellowRobotMaterial );
    leg3.position.set(-20,-10,40);
    groupYellowRobot.add( leg3 );

    var leg4 = new THREE.Mesh( legGeometry, YellowRobotMaterial );
    leg4.position.set(-40,-10,40);
    groupYellowRobot.add( leg4 );

    // top parts
    var topPartGeo = new THREE.BoxGeometry( 2, 2, 82 );
    var topPart1 = new THREE.Mesh( topPartGeo, YellowRobotMaterial );
    topPart1.position.set(-40,0, 0);
    groupYellowRobot.add(topPart1);

    var topPart2 = new THREE.Mesh( topPartGeo, YellowRobotMaterial );
    topPart2.position.set(-20,0, 0);
    groupYellowRobot.add(topPart2);

    // moving top parts
    var groupZ = new THREE.Group();
    var topMovingPartGeo = new THREE.BoxGeometry( 2, 3, 6 );
    var topMovingPart1 = new THREE.Mesh( topMovingPartGeo, GreyRobotMaterial );
    topMovingPart1.position.set(-40,2.5, 0);
    groupZ.add(topMovingPart1);

    var topMovingPart2 = new THREE.Mesh( topMovingPartGeo, GreyRobotMaterial );
    topMovingPart2.position.set(-20,2.5, 0);
    groupZ.add(topMovingPart2);

    // moving top line
    var topMovingLineGeo = new THREE.BoxGeometry( 22, 2, 4 );
    var topMovingLine = new THREE.Mesh( topMovingLineGeo, YellowRobotMaterial );
    topMovingLine.position.set(-30,5, 0);
    groupZ.add(topMovingLine);

    // 2nd moving part
    var groupX = new THREE.Group();
    var topMovingLineGeo = new THREE.BoxGeometry( 2, 2, 4 );
    var topMovingLine = new THREE.Mesh( topMovingLineGeo, GreyRobotMaterial );
    topMovingLine.position.set(-30,3, 0);
    groupX.add(topMovingLine);

    // cord

    var cord = new THREE.Shape();

    cord.moveTo(0, 0);
    cord.lineTo(0.05, -0.03);
    cord.lineTo(0.1, 0);
    cord.lineTo(0.13, 0.05);
    cord.lineTo(0.1, 0.1);
    cord.lineTo(0.05, 0.13);
    cord.lineTo(0, 0.1);
    cord.lineTo(-0.03, 0.05);

    let depthValue = 10.5;

    var extrudeSettings = {
        steps: 10,
        depth: depthValue, // change to move
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0.1,
        bevelSegments: 0
    };

    var geometry = new THREE.ExtrudeGeometry( cord, extrudeSettings );
    var cordmesh = new THREE.Mesh( geometry, GreyRobotMaterial ) ;
    cordmesh.position.set(-30,2, 0);
    var xAxis = new THREE.Vector3(1,0,0);
    rotateAroundWorldAxis(cordmesh, xAxis, Math.PI/2 );
    groupX.add( cordmesh );

    // Yello part
    var groupHook = new THREE.Group();
    var topMovingLineGeo = new THREE.BoxGeometry( 1, 1, 1 );
    var topMovingLine = new THREE.Mesh( topMovingLineGeo, YellowRobotMaterial );
    topMovingLine.position.set(-30,-2.5, 0);
    groupHook.add(topMovingLine);

    // hook
    function CustomSinCurve( scale ) {

        THREE.Curve.call( this );
    
        this.scale = ( scale === undefined ) ? 1 : scale;
    
    }
    
    CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
    CustomSinCurve.prototype.constructor = CustomSinCurve;
    
    CustomSinCurve.prototype.getPoint = function ( t ) {
    
        var tx = t * 3 - 1.5;
        var ty = Math.sin( 2 * Math.PI * t/1.5 );
        var tz = 0;
    
        return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
    
    };
    
    var path = new CustomSinCurve( 10 );
    var geometry = new THREE.TubeGeometry( path, 20, 1, 10, false );
    var mesh = new THREE.Mesh( geometry, GreyRobotMaterial );
    var xAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(mesh, xAxis, Math.PI/1.3 );
    mesh.scale.set(0.1,0.1,0.2);
    mesh.position.set(-29.5,-4.5, 0);
    groupHook.add( mesh );

    groupX.add(groupHook);
    groupZ.add(groupX);
    groupYellowRobot.add(groupZ);
    scene.add(groupYellowRobot);

    // Orange robot
    var OrangeRobotMaterial = new THREE.MeshLambertMaterial( {color: 0xff8800} );
    var GreyRobotMaterial = new THREE.MeshLambertMaterial( {color: 0x635334} );
 
    var groupOrangeRobot = new THREE.Group();
    // base
    var baseBigGeometry = new THREE.CylinderGeometry( 4, 4, 1, 10 );

    var baseBig = new THREE.Mesh( baseBigGeometry, OrangeRobotMaterial );
    baseBig.position.set(0,0,0);
    groupOrangeRobot.add( baseBig );

    var baseSmallGeometry = new THREE.CylinderGeometry( 2, 2, 1, 10 );

    var baseSmall = new THREE.Mesh( baseSmallGeometry, OrangeRobotMaterial );
    baseSmall.position.set(0,1,0);
    groupOrangeRobot.add( baseSmall );


    // rotating Y part
    var groupRotateY = new THREE.Group();

    var baseSmall2 = new THREE.Mesh( baseSmallGeometry, OrangeRobotMaterial );
    baseSmall2.position.set(0,2,0);
    groupRotateY.add( baseSmall2 );

    var boxGeo = new THREE.BoxGeometry( 4, 1, 4 );

    var box = new THREE.Mesh( boxGeo, OrangeRobotMaterial );
    box.position.set(0,3,0);
    groupRotateY.add( box );

    var halfCylinderGeometry = new THREE.CylinderGeometry( 2, 2, 0.5, 10, 1, false, 0, Math.PI );
    var fullCylinderGeometry = new THREE.CylinderGeometry( 2, 2, 2, 10, 1, false, 0, Math.PI );

    var halfCyl1 = new THREE.Mesh( halfCylinderGeometry, OrangeRobotMaterial );
    halfCyl1.position.set(1.25,3.5,0);
    var zAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(halfCyl1, zAxis, Math.PI/2 );
    groupRotateY.add( halfCyl1 );

    var halfCyl2 = new THREE.Mesh( halfCylinderGeometry, OrangeRobotMaterial );
    halfCyl2.position.set(-1.25,3.5,0);
    var zAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(halfCyl2, zAxis, Math.PI/2 );
    groupRotateY.add( halfCyl2 );

    var halfCyl3 = new THREE.Mesh( fullCylinderGeometry, OrangeRobotMaterial );
    halfCyl3.position.set(0,3.5,0);
    var zAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(halfCyl3, zAxis, Math.PI/2 );
    groupRotateY.add( halfCyl3 );


    // rotating X part
    var groupRotateX = new THREE.Group();

    var CylinderGeometry = new THREE.CylinderGeometry( 1, 1, 10, 10);
    CylinderGeometry.translate( 0, 5, 0 );

    var cylinder = new THREE.Mesh( CylinderGeometry, OrangeRobotMaterial );
    cylinder.position.set(0,5,0);
    groupRotateX.add( cylinder );

    var CylinderGeometry = new THREE.CylinderGeometry( 1, 1, 5.5, 10);

    var cylinder = new THREE.Mesh( CylinderGeometry, OrangeRobotMaterial );
    cylinder.position.set(1.5,15,0);
    var zAxis = new THREE.Vector3(0,0,1);
    rotateAroundObjectAxis(cylinder, zAxis, Math.PI/2 );
    groupRotateX.add( cylinder );

    // rotating Z part
    var groupRotateZ = new THREE.Group();

    var CylinderGeometry = new THREE.CylinderGeometry( 1, 1, 10, 10);
    CylinderGeometry.translate( 0, 5, 0 );

    var cylinder = new THREE.Mesh( CylinderGeometry, OrangeRobotMaterial );
    cylinder.position.set(3,15,0);

    cylinder.rotation.x = Math.PI/2;
    groupRotateZ.add( cylinder );

    // grabber
    var grabberGroup = new THREE.Group();
    var baseSmall2 = new THREE.Mesh( baseSmallGeometry, GreyRobotMaterial );
    baseSmall2.position.set(0,2,0);
    grabberGroup.add( baseSmall2 );

    var boxGeo = new THREE.BoxGeometry( 4, 1, 4 );

    var box = new THREE.Mesh( boxGeo, GreyRobotMaterial );
    box.position.set(0,3,0);
    grabberGroup.add( box );

    var halfCylinderGeometry = new THREE.CylinderGeometry( 2, 2, 0.5, 10, 1, false, 0, Math.PI );


    var halfCyl1 = new THREE.Mesh( halfCylinderGeometry, GreyRobotMaterial );
    halfCyl1.position.set(1.25,3.5,0);
    var zAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(halfCyl1, zAxis, Math.PI/2 );
    grabberGroup.add( halfCyl1 );

    var halfCyl2 = new THREE.Mesh( halfCylinderGeometry, GreyRobotMaterial );
    halfCyl2.position.set(-1.25,3.5,0);
    var zAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(halfCyl2, zAxis, Math.PI/2 );
    grabberGroup.add( halfCyl2 );

    grabberGroup.scale.set(0.5, 0.5, 0.5);
    grabberGroup.position.set(3,15,9.25);
    grabberGroup.rotation.x = Math.PI/2;
        

    groupRotateZ.add(grabberGroup);

    var pivotZ = new THREE.Group();
    groupRotateX.add( pivotZ );
    pivotZ.add( groupRotateZ );
    groupRotateZ.position.set(0,-15,0);
    pivotZ.position.set(0,15,0);


    var pivotX = new THREE.Group();
    groupRotateY.add(pivotX);
    pivotX.add(groupRotateX);
    groupRotateX.position.set(0,-5,0);
    pivotX.position.set(0,4.5,0);

    var pivotY = new THREE.Group();
    groupOrangeRobot.add( pivotY );
    pivotY.add( groupRotateY );

    scene.add(groupOrangeRobot);

    // Barrel
    var barrelGroup = new THREE.Group();
    var BarrelMaterial = new THREE.MeshLambertMaterial( {color: 0xa07500} );

    var BarrelGeometry = new THREE.CylinderGeometry( 1, 0.7, 0.5, 10);

    var barrel = new THREE.Mesh( BarrelGeometry, BarrelMaterial );
    barrel.position.set(0,0,0);

    barrelGroup.add(barrel);

    var BarrelGeometry = new THREE.CylinderGeometry( 1.2, 1, 0.5, 10);

    var barrel = new THREE.Mesh( BarrelGeometry, BarrelMaterial );
    barrel.position.set(0,0.5,0);

    barrelGroup.add(barrel);

    var BarrelGeometry = new THREE.CylinderGeometry( 1.3, 1.2, 0.5, 10);

    var barrel = new THREE.Mesh( BarrelGeometry, BarrelMaterial );
    barrel.position.set(0,1,0);

    barrelGroup.add(barrel);

    var BarrelGeometry = new THREE.CylinderGeometry( 1.2, 1.3, 0.5, 10);

    var barrel = new THREE.Mesh( BarrelGeometry, BarrelMaterial );
    barrel.position.set(0,1.5,0);

    barrelGroup.add(barrel);

    var BarrelGeometry = new THREE.CylinderGeometry( 1, 1.2, 0.5, 10);

    var barrel = new THREE.Mesh( BarrelGeometry, BarrelMaterial );
    barrel.position.set(0,2,0);

    barrelGroup.add(barrel);

    var BarrelGeometry = new THREE.CylinderGeometry( 0.7, 1, 0.5, 10);

    var barrel = new THREE.Mesh( BarrelGeometry, BarrelMaterial );
    barrel.position.set(0,2.5,0);

    barrelGroup.add(barrel);

    barrelGroup.scale.set(0.4,0.4,0.4);

    scene.add(barrelGroup);

    // Box
    var boxGroup = new THREE.Group();

    var boxGeo = new THREE.BoxGeometry( 2, 0.1, 2 );
    var box = new THREE.Mesh( boxGeo, GreyRobotMaterial );
    box.position.set(0,0, 0);
    boxGroup.add(box);

    var boxGeo = new THREE.BoxGeometry( 0.1, 0.5, 2 );
    var box = new THREE.Mesh( boxGeo, GreyRobotMaterial );
    box.position.set(1,0.2, 0);
    boxGroup.add(box);

    scene.add(boxGroup);

    var boxGeo = new THREE.BoxGeometry( 0.1, 0.5, 2 );
    var box = new THREE.Mesh( boxGeo, GreyRobotMaterial );
    box.position.set(-1,0.2, 0);
    boxGroup.add(box);

    scene.add(boxGroup);

    var boxGeo = new THREE.BoxGeometry( 2, 0.5, 0.1 );
    var box = new THREE.Mesh( boxGeo, GreyRobotMaterial );
    box.position.set(0,0.2, 1);
    boxGroup.add(box);

    scene.add(boxGroup);

    var boxGeo = new THREE.BoxGeometry( 2, 0.5, 0.1 );
    var box = new THREE.Mesh( boxGeo, GreyRobotMaterial );
    box.position.set(0,0.2, -1);
    boxGroup.add(box);

    handleGroup = new THREE.Group();

    var path = new CustomSinCurve( 10 );
    var geometry = new THREE.TubeGeometry( path, 20, 1, 10, false );
    var mesh = new THREE.Mesh( geometry, GreyRobotMaterial );
    var xAxis = new THREE.Vector3(0,0,1);
   // rotateAroundWorldAxis(mesh, xAxis, Math.PI/1.3 );
    mesh.scale.set(0.1,0.1,0.2);
    mesh.position.set(0,0, 0);
    handleGroup.add( mesh );

    var path = new CustomSinCurve( 10 );
    var geometry = new THREE.TubeGeometry( path, 20, 1, 10, false );
    var mesh = new THREE.Mesh( geometry, GreyRobotMaterial );
    var xAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(mesh, xAxis, Math.PI );
    var xAxis = new THREE.Vector3(0,1,0);
    rotateAroundWorldAxis(mesh, xAxis, Math.PI );
    var xAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(mesh, xAxis, -Math.PI/2 );
    mesh.scale.set(0.1,0.1,0.2);
    mesh.position.set(-1.48,-1.48, 0);
    handleGroup.add( mesh );

    var xAxis = new THREE.Vector3(0,0,1);
    rotateAroundWorldAxis(handleGroup, xAxis, Math.PI/180 * -45 );
    handleGroup.scale.set(0.65,0.65,0.65);
    handleGroup.position.set(0.67,1.1, 0);

    boxGroup.add(handleGroup);
    boxGroup.scale.set(2,2,2);
    var xAxis = new THREE.Vector3(0,1,0);
    rotateAroundWorldAxis(boxGroup, xAxis, Math.PI/180 * 90 );
    scene.add(boxGroup);

    // positioning robots



    // var cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 10, 10);

    // var cylinder = new THREE.Mesh( cylinderGeometry, GreyRobotMaterial );
    // cylinder.position.set(10,-15,0);

    // scene.add( cylinder );

    groupOrangeRobot.position.set(-10,-19,30);

    barrelGroup.position.set(-10,-19.5,45);

    boxGroup.position.set(-24,-19.5,35);

    // animation
    // position 1
    var position1 = new robotControllVars();
    position1.orangeX = 57;
    position1.orangeY = -11.5;
    position1.orangeZ = 0;

    // position 2
    var position2 = new robotControllVars();
    position2.orangeX = 0;
    position2.orangeY = -83;
    position2.orangeZ = 40;

    // position 3
    var position3 = new robotControllVars();
    position3.orangeX = 47;
    position3.orangeY = -83;
    position3.orangeZ = 12;

    // position 4
    var position4 = new robotControllVars();
    position4.orangeX = 57;
    position4.orangeY = -83;
    position4.orangeZ = 0;

    // position 5
    var position5 = position3;

    // position 6
    var position6 = position2;

    // position 7
    var position7 = new robotControllVars();
    position7.yellowX = 0;
    position7.yellowY = 10.5;
    position7.yellowZ = 35;

    // position 8
    var position8 = new robotControllVars();
    position8.yellowX = 5.5;

    // position 9
    var position9 = new robotControllVars();
    position9.yellowX = 0;
    position9.yellowY = 0;

    // position 10
    var position10 = new robotControllVars();
    position10.yellowZ = -35;

    // position 11
    var position11 = new robotControllVars();
    position11.yellowY = 10.5;

    // position 12
    var position12 = new robotControllVars();
    position12.yellowX = -5;

    // position 13
    var position13 = new robotControllVars();
    position13.yellowY = 0;

    let animationPhase = 0;

    let time = new Date();

    // Render

    let render = () => {
        let temp = new Date();
        let deltaTime = temp - time;
        time = temp;

        let speed = deltaTime * animationSpeedR;
        let speedM = deltaTime * animationSpeedM; 

        // animation
        let phaseDone;
        switch (animationPhase) {
            case 1:
                phaseDone = true;
                if (position1.orangeX != robotVars.orangeX)
                {
                    phaseDone = false;
                    robotVars.orangeX += speed;
                    if (robotVars.orangeX > position1.orangeX)
                    {
                        robotVars.orangeX = position1.orangeX;
                    }
                }

                if (position1.orangeY != robotVars.orangeY)
                {
                    phaseDone = false;
                    robotVars.orangeY -= speed;
                    if (robotVars.orangeY < position1.orangeY)
                    {
                        robotVars.orangeY = position1.orangeY;
                    }
                }

                if (position1.orangeZ != robotVars.orangeZ)
                {
                    phaseDone = false;
                    robotVars.orangeZ += speed;
                    if (robotVars.orangeZ > position1.orangeZ)
                    {
                        robotVars.orangeZ = position1.orangeZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                    THREE.SceneUtils.attach( barrelGroup, scene, groupRotateZ );
                }
                break;

            case 2:
                phaseDone = true;
                if (position2.orangeX != robotVars.orangeX)
                {
                    phaseDone = false;
                    robotVars.orangeX -= speed;
                    if (robotVars.orangeX < position2.orangeX)
                    {
                        robotVars.orangeX = position2.orangeX;
                    }
                }

                if (position2.orangeY != robotVars.orangeY)
                {
                    phaseDone = false;
                    robotVars.orangeY -= speed;
                    if (robotVars.orangeY < position2.orangeY)
                    {
                        robotVars.orangeY = position2.orangeY;
                    }
                }

                if (position2.orangeZ != robotVars.orangeZ)
                {
                    phaseDone = false;
                    robotVars.orangeZ += speed;
                    if (robotVars.orangeZ > position2.orangeZ)
                    {
                        robotVars.orangeZ = position2.orangeZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 3:
                phaseDone = true;
                if (position3.orangeX != robotVars.orangeX)
                {
                    phaseDone = false;
                    robotVars.orangeX += speed;
                    if (robotVars.orangeX > position3.orangeX)
                    {
                        robotVars.orangeX = position3.orangeX;
                    }
                }

                if (position3.orangeY != robotVars.orangeY)
                {
                    phaseDone = false;
                    robotVars.orangeY -= speed;
                    if (robotVars.orangeY < position3.orangeY)
                    {
                        robotVars.orangeY = position3.orangeY;
                    }
                }

                if (position3.orangeZ != robotVars.orangeZ)
                {
                    phaseDone = false;
                    robotVars.orangeZ -= speed;
                    if (robotVars.orangeZ < position3.orangeZ)
                    {
                        robotVars.orangeZ = position3.orangeZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 4:
                phaseDone = true;
                if (position4.orangeX != robotVars.orangeX)
                {
                    phaseDone = false;
                    robotVars.orangeX += speed;
                    if (robotVars.orangeX > position4.orangeX)
                    {
                        robotVars.orangeX = position4.orangeX;
                    }
                }

                if (position4.orangeY != robotVars.orangeY)
                {
                    phaseDone = false;
                    robotVars.orangeY -= speed;
                    if (robotVars.orangeY < position4.orangeY)
                    {
                        robotVars.orangeY = position4.orangeY;
                    }
                }

                if (position4.orangeZ != robotVars.orangeZ)
                {
                    phaseDone = false;
                    robotVars.orangeZ -= speed;
                    if (robotVars.orangeZ < position4.orangeZ)
                    {
                        robotVars.orangeZ = position4.orangeZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                    THREE.SceneUtils.detach( barrelGroup, groupRotateZ, scene );
                    THREE.SceneUtils.attach( barrelGroup, scene, boxGroup );
                }
                break;

            case 5:
                phaseDone = true;
                if (position5.orangeX != robotVars.orangeX)
                {
                    phaseDone = false;
                    robotVars.orangeX -= speed;
                    if (robotVars.orangeX < position5.orangeX)
                    {
                        robotVars.orangeX = position5.orangeX;
                    }
                }

                if (position5.orangeY != robotVars.orangeY)
                {
                    phaseDone = false;
                    robotVars.orangeY += speed;
                    if (robotVars.orangeY > position5.orangeY)
                    {
                        robotVars.orangeY = position5.orangeY;
                    }
                }

                if (position5.orangeZ != robotVars.orangeZ)
                {
                    phaseDone = false;
                    robotVars.orangeZ += speed;
                    if (robotVars.orangeZ > position5.orangeZ)
                    {
                        robotVars.orangeZ = position5.orangeZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 6:
                phaseDone = true;
                if (position6.orangeX != robotVars.orangeX)
                {
                    phaseDone = false;
                    robotVars.orangeX -= speed;
                    if (robotVars.orangeX < position6.orangeX)
                    {
                        robotVars.orangeX = position6.orangeX;
                    }
                }

                if (position6.orangeY != robotVars.orangeY)
                {
                    phaseDone = false;
                    robotVars.orangeY += speed;
                    if (robotVars.orangeY > position6.orangeY)
                    {
                        robotVars.orangeY = position6.orangeY;
                    }
                }

                if (position6.orangeZ != robotVars.orangeZ)
                {
                    phaseDone = false;
                    robotVars.orangeZ += speed;
                    if (robotVars.orangeZ > position6.orangeZ)
                    {
                        robotVars.orangeZ = position6.orangeZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 7:
                phaseDone = true;
                if (position7.yellowX != robotVars.yellowX)
                {
                    phaseDone = false;
                    robotVars.yellowX += speedM;
                    if (robotVars.yellowX > position7.yellowX)
                    {
                        robotVars.yellowX = position7.yellowX;
                    }
                }

                if (position7.yellowY != robotVars.yellowY)
                {
                    phaseDone = false;
                    robotVars.yellowY += speedM;
                    if (robotVars.yellowY > position7.yellowY)
                    {
                        robotVars.yellowY = position7.yellowY;
                    }
                }

                if (position7.yellowZ != robotVars.yellowZ)
                {
                    phaseDone = false;
                    robotVars.yellowZ += speedM;
                    if (robotVars.yellowZ > position7.yellowZ)
                    {
                        robotVars.yellowZ = position7.yellowZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 8:
                phaseDone = true;
                if (position8.yellowX != robotVars.yellowX)
                {
                    phaseDone = false;
                    robotVars.yellowX += speedM;
                    if (robotVars.yellowX > position8.yellowX)
                    {
                        robotVars.yellowX = position8.yellowX;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                    THREE.SceneUtils.attach( boxGroup, scene, groupHook );
                }
                break;

            
            case 9:
                phaseDone = true;
                if (position9.yellowX != robotVars.yellowX)
                {
                    phaseDone = false;
                    robotVars.yellowX -= speedM;
                    if (robotVars.yellowX < position9.yellowX)
                    {
                        robotVars.yellowX = position9.yellowX;
                    }
                }

                if (position9.yellowY != robotVars.yellowY)
                {
                    phaseDone = false;
                    robotVars.yellowY -= speedM;
                    if (robotVars.yellowY < position9.yellowY)
                    {
                        robotVars.yellowY = position9.yellowY;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 10:
                phaseDone = true;

                if (position10.yellowZ != robotVars.yellowZ)
                {
                    phaseDone = false;
                    robotVars.yellowZ -= speedM;
                    if (robotVars.yellowZ < position10.yellowZ)
                    {
                        robotVars.yellowZ = position10.yellowZ;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 11:
                phaseDone = true;

                if (position11.yellowY != robotVars.yellowY)
                {
                    phaseDone = false;
                    robotVars.yellowY += speedM;
                    if (robotVars.yellowY > position11.yellowY)
                    {
                        robotVars.yellowY = position11.yellowY;
                    }
                }

                if (phaseDone)
                {
                    THREE.SceneUtils.detach( boxGroup, groupHook, scene );
                    THREE.SceneUtils.detach( barrelGroup, boxGroup, scene );
                    animationPhase += 1;
                }
                break;

            case 12:
                phaseDone = true;

                if (position12.yellowX != robotVars.yellowX)
                {
                    phaseDone = false;
                    robotVars.yellowX -= speedM;
                    if (robotVars.yellowX < position12.yellowX)
                    {
                        robotVars.yellowX = position12.yellowX;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            case 13:
                phaseDone = true;

                if (position13.yellowY != robotVars.yellowY)
                {
                    phaseDone = false;
                    robotVars.yellowY -= speedM;
                    if (robotVars.yellowY < position13.yellowY)
                    {
                        robotVars.yellowY = position13.yellowY;
                    }
                }

                if (phaseDone)
                {
                    animationPhase += 1;
                }
                break;

            default:
                break;
        }



        // Yellow
        groupZ.position.set(0,0, robotVars.yellowZ);
        groupX.position.set(robotVars.yellowX,0,0);
        groupHook.position.set(0,-robotVars.yellowY,0);
        extrudeSettings.depth = 4 + robotVars.yellowY;

        if (depthValue != extrudeSettings.depth )
        {
            depthValue = extrudeSettings.depth;
            groupX.remove( cordmesh );
            var geometry = new THREE.ExtrudeGeometry( cord, extrudeSettings );
            cordmesh = new THREE.Mesh( geometry, GreyRobotMaterial ) ;
            cordmesh.position.set(-30,2, 0);
            var xAxis = new THREE.Vector3(1,0,0);
            rotateAroundWorldAxis(cordmesh, xAxis, Math.PI/2 );
            groupX.add( cordmesh );
        }

        // Orange
        pivotY.rotation.y = Math.PI/180 * robotVars.orangeY;
        pivotX.rotation.x = Math.PI/180 * robotVars.orangeX;
        pivotZ.rotation.x = Math.PI/180 * robotVars.orangeZ;

        renderer.render( scene, camera );

        requestAnimationFrame( render );

    };

    window.addEventListener( 'resize', function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }, false );

    render();


    function animate()
    {
        animationPhase = 1;
        resetVars();
    }

    function resetVars() {
        robotVars.yellowX = 0;
        robotVars.yellowY = 6.5;
        robotVars.yellowZ = 0;
        robotVars.orangeX = 0;
        robotVars.orangeY = 0;
        robotVars.orangeZ = -90;
        barrelGroup.position.set(-10,-19.5,45);
        boxGroup.position.set(-24,-19.5,35);
    }
}

// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}


