
from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort,  jsonify
from flask_sqlalchemy import SQLAlchemy
import json
from marshmallow import Schema, fields, post_load
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS, cross_origin
import argparse

# Parse input arguments, default to rei's laptop
def build_arg_parser():
    parser = argparse.ArgumentParser(description='List All Available Arguments')
    parser.add_argument("-url", dest="load_balancer_url", default="DESKTOP-KDJ01G9",
            help="Load Balancer Url", required=False)
    return parser

args = build_arg_parser().parse_args()
app = Flask(__name__)
CORS(app)
db = SQLAlchemy(app)
engine=create_engine('db://root:@'+args.load_balancer_url+':26257/defaultdb', echo=True)

class Sessions():
    def __init__(self, SessionName, Location = None, DateTime = None, ActiveStatus=True, LiveStatus=False, SessionID = 0):
        self.SessionName = SessionName
        self.Location = Location
        self.DateTime = DateTime
        self.ActiveStatus = ActiveStatus
        self.LiveStatus = LiveStatus
        self.SessionID = SessionID

class SessionSchema(Schema):
    SessionName= fields.Str()
    Location=fields.Str()
    DateTime=fields.Str()
    ActiveStatus=fields.Bool()
    LiveStatus=fields.Bool()
    SessionID=fields.Int()

    #Deserialise from JSON to Objects
    @post_load
    def make_session(self, data, **kwargs):
        return Sessions(**data)

class Users():
    def __init__(self, Nickname, SessionID, ):
        self.Nickname = Nickname
        self.SessionID = SessionID

class UserSchema(Schema):
    Nickname= fields.Str()
    SessionID=fields.Int()

    @post_load
    def make_user(self, data, **kwargs):
        return Users(**data)

class Bugs():
    def __init__(self, BugName, ImagePath, Bio):
        self.BugName = BugName
        self.ImagePath = ImagePath
        self.Bio = Bio

class BugSchema(Schema):
    BugName = fields.Str()
    ImagePath = fields.Str()
    Bio = fields.Str()

    @post_load
    def make_bug(self, data, **kwargs):
        return Bugs(**data)

class Ratings():
    def __init__(self, BugID, Nickname, SessionID, Rating):
        self.BugID = BugID
        self.Nickname = Nickname
        self.SessionID = SessionID
        self.Rating =Rating

class RatingSchema(Schema):
    BugID = fields.Int()
    Nickname = fields.Str()
    SessionID = fields.Int()
    Rating = fields.Float()

    @post_load
    def make_rating(self, data, **kwargs):
        return Ratings(**data)

class Leaderboard():
    def __init__(self, BugName, AvgRating, ImagePath):
        self.BugName = BugName
        self.AvgRating = AvgRating
        self.ImagePath = ImagePath

class LeaderboardSchema(Schema):
    BugName = fields.Str()
    AvgRating = fields.Float()
    ImagePath = fields.Str()

    @post_load
    def make_rating(self, data, **kwargs):
        return Leaderboard(**data)

@app.route('/')
def home():
    return jsonify('REST API Works'),200


@app.route('/sessions', methods=['GET','POST','PUT'])
def sessions():
    # Admin - List all available Sessions
    if request.method=='GET':
        AllSessions=[]
        SessionsToDisplay=engine.execute('SELECT * FROM Sessions;')
        for _s in SessionsToDisplay:
            session=Sessions(_s.sessionname,_s.location,_s.datetime,_s.activestatus,_s.livestatus,_s.sessionid)
            schema=SessionSchema()
            result = schema.dump(session)
            AllSessions.append(result.data)
        return jsonify(AllSessions), 200


    # Admin - Create Session
    elif request.method=='POST':
        try:

            schema = SessionSchema()
            result = schema.load(request.get_json()).data
            DateTime=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            sql="INSERT INTO Sessions (SessionName, Location, DateTime, ActiveStatus) VALUES (%s, %s, %s, %s)"
            engine.execute(sql, [result.SessionName, result.Location, DateTime, result.ActiveStatus])

            ''' Return Created Session
            session =Sessions(result.SessionName,result.Location,DateTime,result.ActiveStatus)
            new_sesison=SessionSchema().dump(session).data
            return(jsonify(new_sesison),201)
            '''
            return jsonify({"Message":"New Session is created."}), 201
        except IntegrityError:
            return jsonify({"Message": "Violate unique key constraint on SessionName"}), 403

    # Admin - Edit Session Details such as changing the Active Status or Live Status
    elif request.method=='PUT':
        schema = SessionSchema()
        result = schema.load(request.get_json()).data
        sql="UPDATE sessions SET ActiveStatus  = %s , LiveStatus = %s, Location =%s, DateTime =%s WHERE SessionName = %s; "
        engine.execute(sql, [ result.ActiveStatus, result.LiveStatus, result.Location, result.DateTime, result.SessionName ])
        return jsonify({"Message":"Session Edited"}),201

    else :
        return jsonify({"Message": "Server Error"}), 500


@app.route('/sessions/active', methods=['GET'])
def activeSessions():
    # USER- Show Active Sessions
    if request.method=='GET':
        AllSessions=[]
        SessionsToDisplay=engine.execute('SELECT SessionName, SessionID FROM Sessions WHERE ActiveStatus=True;')
        for _s in SessionsToDisplay:
            session=Sessions(_s.sessionname,SessionID=_s.sessionid)
            schema=SessionSchema(many=False, exclude=("Location","DateTime","ActiveStatus","LiveStatus"))
            result = schema.dump(session)
            AllSessions.append(result.data)
        return jsonify(AllSessions), 200

    else :
        return jsonify({"Message": "Server Error"}), 500

# USER - Create Nickname
@app.route('/users', methods=['POST'])
def users():
    # User- Add a new user
    if request.method=='POST':
        try:
            schema = UserSchema()
            result = schema.load(request.get_json()).data
            sql='INSERT INTO Users (Nickname,SessionID) VALUES   (%s ,%s);'
            engine.execute(sql, [result.Nickname, result.SessionID])
            return jsonify({"Message":"New User Created"}), 201
        except TypeError:
            return jsonify({"Message": "SessionName does not exist."}), 403
        except IntegrityError:
            return jsonify({"Message": "Violate unique key constraint on Nickname. User already existed"}), 403
    else :
        return (jsonify({"Message": "Server Error"}),500)

# Admin - Get total number of users for each session
@app.route('/users/totaluser/<int:id>', methods=['GET'])
def totaluser(id):
    if request.method=='GET':
        sql="SELECT COUNT(*) FROM Users WHERE sessionid=%s;"
        number = engine.execute(sql,id)
        count =0
        for n in number:
            count = n[0]
            print(count)
        return jsonify(count)
    else:
        return(jsonify({"Message": "Server Error"}),500)

# USER - Get Session Info from Session ID
@app.route('/sessions/<int:id>', methods=['GET'])
def getStatus(id):
    if request.method=='GET':
        try:

            sql='SELECT * FROM Sessions WHERE SessionID=%s;'
            sessions=engine.execute(sql,id)
            for _s in sessions:
                session=Sessions(_s.sessionname,_s.location,_s.datetime,_s.activestatus,_s.livestatus,_s.sessionid)
                print(session.SessionName)
                schema=SessionSchema()
                result = schema.dump(session)
            return jsonify(result.data), 200
        except UnboundLocalError:
            return jsonify({"Message": "SessionID is out of range."}), 400
    else :
        return (jsonify({"Message": "Server Error"}),500)

# USER - Get total number of bugs for iteration
@app.route('/bugs/totalbugs', methods=['GET'])
def getTotalBug():
    if request.method=='GET':
        sql="SELECT COUNT(*) FROM Bugs;"
        number = engine.execute(sql)
        count =0
        for n in number:
            count = n[0]
        return jsonify(count)
    else:
        return(jsonify({"Message": "Server Error"}),500)

# USER - Get Bug Info
@app.route('/bugs/<int:id>', methods=['GET'])
def getBug(id):
    if request.method=='GET':
        try:
            bugInfo=engine.execute('SELECT BugName, ImagePath, Bio FROM Bugs WHERE bugid=(%s);',(id)).first()
            bug=Bugs(bugInfo.bugname, bugInfo.imagepath, bugInfo.bio)
            schema=BugSchema()
            result=schema.dump(bug)
            return(jsonify(result.data))
        except AttributeError:
            return jsonify({"Message": "BugID is out of range."}), 400
        except TypeError:
            return jsonify({"Message": "BugID is out of range."}), 400
    else:
        return(jsonify({"Message": "Server Error"}),500)


# USER - Post Bug Rating
@app.route('/ratings', methods=['POST','PUT'])
def ratings():
    # USER - Post Bug Rating
    if request.method=='POST':
        try:
            schema = RatingSchema()
            result = schema.load(request.get_json()).data
            sql="INSERT INTO Ratings VALUES ((SELECT UserID FROM Users WHERE Nickname=%s AND SessionID =%s), %s, %s)"
            engine.execute(sql, [result.Nickname, result.SessionID, result.BugID, result.Rating])
            return jsonify({"Message":"User's rating is inserted."}), 201
        except IntegrityError:
            return jsonify({"Message": "Violate unique key constraint on UserID. User's rating already existed"}), 403
    # USER - Update Bug Rating
    elif request.method=='PUT':
        schema = RatingSchema()
        result = schema.load(request.get_json()).data
        sql = "UPDATE Ratings SET rating =%s WHERE (SELECT UserID FROM Users WHERE Nickname=%s AND SessionID= %s ) = Ratings.UserID AND bugid = %s"
        engine.execute(sql, [result.Rating, result.Nickname, result.SessionID, result.BugID])
        return jsonify({"Message":"User's rating is updated."}), 201
    else:
        return(jsonify({"Message": "Server Error"}),500)

# Admin - Get Leaderboard
@app.route('/ratings/<int:SessionID>', methods=['GET'])
def leaderboard(SessionID):
    if request.method=='GET':
        AllResults=[]
        sql="SELECT BugName, ImagePath, AVG (Rating) AS AvgRating FROM (SELECT Ratings.BugID, Ratings.Rating, Users.SessionID, Bugs.BugName, Bugs.ImagePath FROM Ratings INNER JOIN Users ON Ratings.UserID = Users.UserID INNER JOIN  Bugs ON Bugs.BugID = Ratings.BugID)  WHERE SessionID=%s GROUP BY BugName, ImagePath ORDER BY AvgRating DESC"
        ranking= engine.execute(sql, (SessionID))
        for _r in ranking:
            rank = Leaderboard(_r.bugname,_r.avgrating,_r.imagepath)
            schema=LeaderboardSchema()
            result=schema.dump(rank)
            AllResults.append(result.data)
        return jsonify(AllResults), 201
    else:
        return(jsonify({"Message": "Server Error"}),500)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
