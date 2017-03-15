Scenario: Ground-based tracking of one GEO object by one telescope.
<for starters, more complex scenarios, incl. space-based observers are available...>

Description of the Output:

Geostat.tle:
- No output (rather input for my tool, but might be useful for SpaceView)
- TLE of the observed object (however, object position evolution is also described in Position_OBJ-00000001.dat)


Observation-Plan_OBS-0001.dat
- describes pointing direction and movement of observer's (observer 1) line-of-sight (LOS) and orientation of the FOV (field-of-view)
- FOV = 3 deg x 3deg, rectangular (not specified in this file but in an input file)


Output_MC-0001_OBJ-00000001.dat (and Output_MC-0001_OBJ-00000001_ECEF.dat)
- OD results for object 1: Estimated state vector and covariance ellipsoid
- ECEF version provides same info in ECEF coordinates
- does not necessarily have to be used for visualisation, usually the estimated and the exact orbit cannot be distinguished in the visualisation
- however, other info (e.g. along-track covariance P_RTN(2,2)) could be plotted in a 2D-Graph next to the visualisation


Position_OBJ-00000001.dat
- exact object position of object 1 in ECI and ECEF reference frames
- produced just for visualisation


Position_OBS-0001.dat
- exact object position of observer 1 in ECI and ECEF reference frames
- produced just for visualisation


Tracklet_MC-0001_OBS-0001_OBJ-00000001_TKR-00001.otdf (and the others)
- observation tracklet obtained by observer 1 from object 1
- = obtained measurements
- can be used to indicate when the object as been observed
