var LOAD = "load";
var UN_LOAD = "unLoad";

var DEBUG_MODE = false;
var LIGHT_MODE = false;

function Kicker(Options) {
    var self = this;
    var loadData = Options.LoadData;
    var mats = [];
    var playerGeo;
    var skinMesh;
    var scene = Options.Scene;
    var currentAction = undefined;
    var currentAnimation = undefined;
    //var DEBUG_MODE = DEBUG_MODE;
    var collideShapeState = 0;
    var visibilityState;
    // var loadState = UN_LOAD; // unload load
    var _plusTeta = 90 * Math.PI / 180;
    self.materials ={
        rootMaterial: undefined,
        headMat: undefined,
        bodyMat: undefined,
        shoeMat: undefined
    };
    var bones ={
        hips: undefined,
        leftArm: undefined,
        leftForeArm: undefined,
        rightArm: undefined,
        rightForeArm: undefined,
        leftUpLeg: undefined,
        leftLeg: undefined,
        leftFoot: undefined,
        rightUpLeg: undefined,
        rightLeg: undefined,
        rightFoot: undefined,
        neck: undefined,
        leftHand : undefined,
        rightHand : undefined
    };
    var collideShapes ={
        hips: undefined,
        leftArm: undefined,
        leftForeArm: undefined,
        rightArm: undefined,
        rightForeArm: undefined,
        leftUpLeg: undefined,
        leftLeg: undefined,
        leftFoot: undefined,
        rightUpLeg: undefined,
        rightLeg: undefined,
        rightFoot: undefined,
        neck: undefined

    };

    var initialPosition;
    var position = {
        x: 0,
        y: 0,
        z: 0
    };
    var rotation ={
        x: 0,
        y: 0,
        z: 0
    };
    var animationMixer;
    var animationActions = {};


    function constructor(Data) {

        playerGeo = loadData.geometry;

        console.log("kicker constructor", loadData);

        var len = playerGeo.children.length;

        skinMesh = playerGeo.children[len - 1];

        mats = skinMesh.material;

        initialPosition = Data.Position;
        position = Data.Position;
        rotation = Data.Rotation;
        collideShapeState = Data.CollideShapeState;

        // var NMap = Data.NormalMap.clone();
        // NMap.needsUpdate = true;

        var basicMat = new THREE.MeshPhongMaterial({
            // normalMap: NMap,
            specular: 1,
            shininess: 20
            //reflectivity : 0.1
            //metal : true
        });


//         basicMat.skinning = true;
// //        basicMat.needsUpdate = true;
//         for (var i = 0; i < mats.length; i++) {
//             if (mats[i].name === "M_Head") {
//                 self.materials.headMat = basicMat.clone();
//                 self.materials.headMat.map = Data.HeadColorMap;
//                 self.materials.headMat.name = mats[i].name;
//                 mats[i] = self.materials.headMat;
//             }
//
//             if (mats[i].name === "M_Body") {
//                 self.materials.bodyMat = basicMat.clone();
// //                self.materials.bodyMat.skinning = true;
// //                self.materials.bodyMat.needsUpdate = true;
//                 self.materials.bodyMat.map = Data.BodyColorMap;
//                 self.materials.bodyMat.name = mats[i].name;
//                 mats[i] = self.materials.bodyMat;
//             }
//
//             if (mats[i].name === "M_Shoe") {
//                 self.materials.shoeMat = basicMat.clone();
//                 self.materials.shoeMat.map = Data.ShoeColorMap;
//                 self.materials.shoeMat.name = mats[i].name;
//                 mats[i] = self.materials.shoeMat;
//             }
//
//             skinMesh.material[i] = mats[i];
//         }

        visibilityState = Data.VisibilityState;

        create();
    }

    function create() {
        self.materials.rootMaterial = mats;

        playerGeo.castShadow = true;
        playerGeo.position.set(position.x, position.y, position.z);
        playerGeo.rotation.set(rotation.x * Math.PI / 180, rotation.y * Math.PI / 180, rotation.z * Math.PI / 180);

        scene.add(playerGeo);

        // var update = THREE.Bone.prototype.update;
        // THREE.Bone.prototype.update = function (parentSkinMatrix, forceUpdate) {
        //     update.call(this, parentSkinMatrix, forceUpdate);
        //     this.updateMatrixWorld(true);
        // };
        // THREE.Object3D.prototype.update = function () {
        // };

        if (collideShapeState)
            createCollideShape();
        playerGeo.updateMatrixWorld(true);

        createBoneReference();

        animationMixer = new THREE.AnimationMixer( playerGeo );
        initAnimate();
        self.play("kick");

        // loadState = LOAD;
        playerGeo.visible = visibilityState;

    }

    function createBoneReference() {
        playerGeo.traverse(function (bone) {
            if (bone instanceof THREE.Bone && bone.name === "Hips") {
                bones.hips = bone;
                collideShapeState && scene.add(collideShapes.hips);
            }
            if (bone instanceof THREE.Bone && bone.name === "LeftUpLeg") {
                bones.leftUpLeg = bone;
                collideShapeState && scene.add(collideShapes.leftUpLeg);
            }
            if (bone instanceof THREE.Bone && bone.name === "LeftLeg") {
                bones.leftLeg = bone;
                collideShapeState && scene.add(collideShapes.leftLeg);
            }
            if (bone instanceof THREE.Bone && bone.name === "LeftFoot") {
                bones.leftFoot = bone;
                collideShapeState && scene.add(collideShapes.leftFoot);
            }
            if (bone instanceof THREE.Bone && bone.name === "RightUpLeg") {
                bones.rightUpLeg = bone;
                collideShapeState && scene.add(collideShapes.rightUpLeg);

            }
            if (bone instanceof THREE.Bone && bone.name === "RightLeg") {
                bones.rightLeg = bone;
                collideShapeState && scene.add(collideShapes.rightLeg);
            }
            if (bone instanceof THREE.Bone && bone.name === "RightFoot") {
                bones.rightFoot = bone;
                collideShapeState && scene.add(collideShapes.rightFoot);
            }
            if (bone instanceof THREE.Bone && bone.name === "LeftForeArm") {
                bones.leftForeArm = bone;
                collideShapeState && scene.add(collideShapes.leftForeArm);
            }
            if (bone instanceof THREE.Bone && bone.name === "RightArm") {
                bones.rightArm = bone;
                collideShapeState && scene.add(collideShapes.rightArm);
            }
            if (bone instanceof THREE.Bone && bone.name === "RightForeArm") {
                bones.rightForeArm = bone;
                collideShapeState && scene.add(collideShapes.rightForeArm);
            }
            if (bone instanceof THREE.Bone && bone.name === "Neck") {
                bones.neck = bone;
                collideShapeState && scene.add(collideShapes.neck);
            }
            if (bone instanceof THREE.Bone && bone.name === "LeftArm") {
                bones.leftArm = bone;
                collideShapeState && scene.add(collideShapes.leftArm);
            }

            if (bone instanceof THREE.Bone && bone.name === "LeftHand") {
                bones.leftHand = bone;
            }

            if (bone instanceof THREE.Bone && bone.name === "RightHand") {
                bones.rightHand = bone;
            }
        })
    }

    function createCollideShape() {
        var collidMat = Physijs.createMaterial(new THREE.MeshLambertMaterial({color: new THREE.Color(0x11bbdd)}), 0.8, 1);

        collideShapes.hips = new Physijs.CylinderMesh(new THREE.CylinderGeometry(17, 17, 70), collidMat, 0);
        collideShapes.hips.visible = DEBUG_MODE;

        collideShapes.leftArm = new Physijs.CylinderMesh(new THREE.CylinderGeometry(7, 7, 32), collidMat, 0);
        collideShapes.leftArm.visible = DEBUG_MODE;


        collideShapes.leftForeArm = new Physijs.CylinderMesh(new THREE.CylinderGeometry(7, 7, 40), collidMat, 0);
        collideShapes.leftForeArm.visible = DEBUG_MODE;

        collideShapes.rightArm = new Physijs.CylinderMesh(new THREE.CylinderGeometry(7, 7, 32), collidMat, 0);
        collideShapes.rightArm.visible = DEBUG_MODE;

        collideShapes.rightForeArm = new Physijs.CylinderMesh(new THREE.CylinderGeometry(7, 7, 40), collidMat, 0);
        collideShapes.rightForeArm.visible = DEBUG_MODE;

        collideShapes.leftUpLeg = new Physijs.CylinderMesh(new THREE.CylinderGeometry(10, 10, 50), collidMat, 0);
        collideShapes.leftUpLeg.visible = DEBUG_MODE;

        collideShapes.leftLeg = new Physijs.CylinderMesh(new THREE.CylinderGeometry(10, 10, 55), collidMat, 0);
        collideShapes.leftLeg.visible = DEBUG_MODE;

        collideShapes.leftFoot = new Physijs.CylinderMesh(new THREE.CylinderGeometry(10, 10, 15), collidMat, 0);
        collideShapes.leftFoot.visible = DEBUG_MODE;

        collideShapes.rightUpLeg = new Physijs.CylinderMesh(new THREE.CylinderGeometry(10, 10, 55), collidMat, 0);
        collideShapes.rightUpLeg.visible = DEBUG_MODE;

        collideShapes.rightLeg = new Physijs.CylinderMesh(new THREE.CylinderGeometry(10, 10, 55), collidMat, 0);
        collideShapes.rightLeg.visible = DEBUG_MODE;

        collideShapes.rightFoot = new Physijs.CylinderMesh(new THREE.CylinderGeometry(10, 10, 15), collidMat, 0);
        collideShapes.rightFoot.visible = DEBUG_MODE;

        collideShapes.neck = new Physijs.CylinderMesh(new THREE.SphereGeometry(15), collidMat, 0);
        collideShapes.neck.visible = DEBUG_MODE;

    }

    function initAnimate() {
        // console.log("aaa", loadData);

        // var animations = playerGeo.animations || [];
        // for (var i = 0; i < animations.length; i++) {
        //     var animateData = animations[i];
        //     animationActions[animateData.name] = animationMixer.clipAction(animateData);
        // }

        var animations = loadData.animations;
        for(var actionName in animations) {
            animationActions[actionName] = animationMixer.clipAction(animations[actionName].animations[0]);
        }
    }


    this.getLoadState = function () {
        // return loadState;
    };

    this.computeCollideShapeBehavior = function () {
        if (playerGeo) {
            for (var boneName in bones) {
                var bonePos = new THREE.Vector3();
                bonePos.setFromMatrixPosition(bones[boneName].matrixWorld);
                collideShapes[boneName].__dirtyRotation = true;
                collideShapes[boneName].__dirtyPosition = true;

                collideShapes[boneName].setRotationFromMatrix(bones[boneName].matrixWorld);
                collideShapes[boneName].position.set(bonePos.x, bonePos.y, bonePos.z);

                switch (collideShapes[boneName]) {
                    case collideShapes.hips :
                        collideShapes[boneName].translateY(15);
                        break;

                    case collideShapes.leftArm :
                        collideShapes[boneName].rotation.z = collideShapes[boneName].rotation.z + _plusTeta;
                        break;

                    case collideShapes.leftForeArm :
                        collideShapes[boneName].rotation.z = collideShapes[boneName].rotation.z + _plusTeta;
                        collideShapes[boneName].translateY(-15);
                        break;

                    case collideShapes.rightArm :
                        collideShapes[boneName].rotation.z = collideShapes[boneName].rotation.z + _plusTeta;
                        break;

                    case collideShapes.rightForeArm :
                        collideShapes[boneName].rotation.z = collideShapes[boneName].rotation.z + _plusTeta;
                        collideShapes[boneName].translateY(15);
                        break;

                    case collideShapes.leftUpLeg :
                        collideShapes[boneName].translateY(-15);
                        break;

                    case collideShapes.leftLeg :
                        collideShapes[boneName].translateY(-15);
                        collideShapes[boneName].translateZ(-7);
                        break;


                    case collideShapes.rightUpLeg :
                        collideShapes[boneName].translateY(-15);
                        break;

                    case collideShapes.rightLeg :
                        collideShapes[boneName].translateY(-15);
                        collideShapes[boneName].translateZ(-7);
                        break;


                    case collideShapes.rightFoot :
                        collideShapes[boneName].position.set(bonePos.x, bonePos.y - 5, bonePos.z);
                        break;

                    case collideShapes.neck :
                        collideShapes[boneName].translateY(15);
                        break;

                }

                //if (collideShaps[boneName] === collideShaps.hips) {
                //
                //    collideShaps[boneName].translateY(15);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.leftArm) {
                //    collideShaps[boneName].rotation.z = collideShaps[boneName].rotation.z + _plusTeta;
                //
                //}
                //
                //if (collideShaps[boneName] === collideShaps.leftForeArm) {
                //    collideShaps[boneName].rotation.z = collideShaps[boneName].rotation.z + _plusTeta;
                //    collideShaps[boneName].translateY(-15);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.rightArm) {
                //    collideShaps[boneName].rotation.z = collideShaps[boneName].rotation.z + _plusTeta;
                //}
                //
                //if (collideShaps[boneName] === collideShaps.rightForeArm) {
                //    collideShaps[boneName].rotation.z = collideShaps[boneName].rotation.z + _plusTeta;
                //    collideShaps[boneName].translateY(15);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.leftUpLeg) {
                //    collideShaps[boneName].translateY(-15);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.leftLeg) {
                //    collideShaps[boneName].translateY(-15);
                //    collideShaps[boneName].translateZ(-7);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.rightUpLeg) {
                //    collideShaps[boneName].translateY(-15);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.rightLeg) {
                //    collideShaps[boneName].translateY(-15);
                //    collideShaps[boneName].translateZ(-7);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.rightFoot) {
                //    collideShaps[boneName].position.set(bonePos.x, bonePos.y - 5, bonePos.z);
                //}
                //
                //if (collideShaps[boneName] === collideShaps.neck) {
                //    collideShaps[boneName].translateY(15);
                //}
            }
        }
    };

    this.resetCollideShapePosition = function () {
        if (playerGeo) {
            for (var boneName in bones) {
                collideShapes[boneName].__dirtyPosition = true;
                collideShapes[boneName].position.set(RESET_COLID_POSITION.x, RESET_COLID_POSITION.y, RESET_COLID_POSITION.z);
            }
        }
    };

    this.getBone = function (boneName) {
        return bones[boneName];
    };

    this.getMaterial = function () {
        return materials.rootMaterial;
    };

    this.setMaterial = function (Material) {
        self.materials.rootMaterial = Material;
    };

    this.setPosition = function (Position) {
        playerGeo.position.set(Position.x, Position.y, Position.z);
        position = Position;
    };

    this.resetPosition = function () {
        this.setPosition(initialPosition);
    };

    this.setRealPosition = function () {
        var bonePos = new THREE.Vector3();
        bonePos.setFromMatrixPosition(bones.hips.matrixWorld);
        playerGeo.position.x = bonePos.x;
        playerGeo.position.z = bonePos.z;
    };

    this.setRotation = function (Rotation) {
        playerGeo.rotation.set(Rotation.x * Math.PI / 180, Rotation.y * Math.PI / 180, Rotation.z * Math.PI / 180);
        rotation = Rotation;
    };

    this.getKicker = function () {
        return playerGeo;
    };

    this.getPosition = function () {
        return playerGeo.position;
    };

    this.getCollideShapes = function (shapeName) {
        return collideShapes[shapeName];
    };

    this.setHeadColorMap = function (ColorMap) {
        self.materials.headMat.map = ColorMap.clone();
        self.materials.headMat.map.needsUpdate = true;
    };

    this.setHeadNormalMap = function (NormalMap) {
        self.materials.headMat.normalMap = NormalMap.clone();
        self.materials.headMat.normalMap.needsUpdate = true;
    };

    this.setBodyColorMap = function (ColorMap) {
        self.materials.bodyMat.map = ColorMap.clone();
        self.materials.bodyMat.map.needsUpdate = true;
    };

    this.setBodyNormalMap = function (NormalMap) {
        self.materials.bodyMat.normalMap = NormalMap.clone();
        self.materials.bodyMat.normalMap.needsUpdate = true;
    };

    this.setShoeColorMap = function (ColorMap) {
        self.materials.shoeMat.map = ColorMap.clone();
        self.materials.shoeMat.map.needsUpdate = true;
    };

    this.setShoeNormalMap = function (NormalMap) {
        self.materials.shoeMat.normalMap = NormalMap.clone();
        self.materials.shoeMat.normalMap.needsUpdate = true;
    };

    this.play = function (actionName,startTime) {
        currentAction = actionName;
        animationActions[actionName].play(startTime);
    };

    this.stop = function () {
        animationMixer.stop();
    };

    this.pause = function () {
        //currentAnimation.pause();
        // animationMixer.stop(currentAnimation);
        currentAnimation.stop();
    };

    this.resume = function () {

        // animationMixer.play(currentAnimation);
        currentAnimation.play();
    };


    this.getAnimationLength = function (Action) {
        if (Action) {
            return animationActions[Action].getClip().duration;
        } else {
            return animationActions[currentAction].getClip().duration;
        }
    };

    this.setVisibilityState = function (State) {
        playerGeo.visible = State;
        visibilityState = State
    };

    this.getVisibilityState = function () {
        return visibilityState;
    };

    this.getCurrentAnimateTime = function () {
        if (currentAnimation)
            return currentAnimation.currentTime;
    };

    this.getCurrentAnimateLength = function () {
        return animationActions[currentAction].getClip().duration;
    };

    this.update = function(delta) {
        animationMixer.update(delta);
    };

    constructor(Options);
}