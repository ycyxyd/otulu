import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class LocationScreen extends StatefulWidget {
  const LocationScreen({super.key});

  @override
  State<LocationScreen> createState() => _LocationScreenState();
}

class _LocationScreenState extends State<LocationScreen> {
  List<dynamic> _pois = [];
  bool _isLoading = false;
  String _statusMessage = "Press 'Locate Me' to find nearby places.";
  Position? _currentPosition;

  Future<void> _getCurrentLocation() async {
    setState(() {
      _isLoading = true;
      _statusMessage = "Getting location...";
    });

    var status = await Permission.location.request();
    if (status.isGranted) {
      try {
        Position position = await Geolocator.getCurrentPosition(
            desiredAccuracy: LocationAccuracy.high);
        
        setState(() {
          _currentPosition = position;
          _statusMessage = "Location found: ${position.latitude}, ${position.longitude}";
        });

        await _fetchPOIs(position.latitude, position.longitude);
        _checkAISuggestion(position);

      } catch (e) {
        setState(() {
          _statusMessage = "Error getting location: $e";
          _isLoading = false;
        });
      }
    } else {
      setState(() {
        _statusMessage = "Location permission denied.";
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchPOIs(double lat, double lng, {String? query}) async {
    try {
      final uri = Uri.http('10.0.2.2:8080', '/api/v1/location/nearby', {
        'lat': lat.toString(),
        'lng': lng.toString(),
        if (query != null) 'query': query,
      });

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        setState(() {
          _pois = json.decode(response.body);
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to load POIs');
      }
    } catch (e) {
      print('Error fetching POIs: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _checkAISuggestion(Position position) async {
    // Simulate proactive AI suggestion
    // In a real app, this might be triggered by significant location changes or time
    
    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:8080/api/v1/ai/suggest'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'lat': position.latitude,
          'lng': position.longitude,
          'localTime': DateTime.now().toString(),
          'userPrompt': null // Proactive
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _showAIDialog(data['suggestion']);
      }
    } catch (e) {
      print("AI Suggestion Error: $e");
    }
  }

  void _showAIDialog(String suggestion) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.auto_awesome, color: Colors.purple),
            SizedBox(width: 8),
            Text("AI Suggestion"),
          ],
        ),
        content: Text(suggestion),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Dismiss"),
          ),
          FilledButton(
            onPressed: () {
              // TODO: Implement "Accept" logic (e.g., open route)
              Navigator.pop(context);
            },
            child: const Text("Let's Go!"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nearby & AI'),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search (e.g., Parking, Bar...)',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.my_location),
                  onPressed: _getCurrentLocation,
                ),
              ),
              onSubmitted: (value) {
                if (_currentPosition != null) {
                  _fetchPOIs(_currentPosition!.latitude, _currentPosition!.longitude, query: value);
                }
              },
            ),
          ),
          
          if (_isLoading)
            const LinearProgressIndicator(),
            
          // Status Message
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(_statusMessage, style: const TextStyle(color: Colors.grey)),
          ),

          // POI List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _pois.length,
              itemBuilder: (context, index) {
                final poi = _pois[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12.0),
                  child: ListTile(
                    leading: _getIconForType(poi['type']),
                    title: Text(poi['name']),
                    subtitle: Text("${poi['type']} • ${poi['distance']} • ${poi['details']}"),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // TODO: Open details or map
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _getIconForType(String type) {
    switch (type) {
      case 'PARKING': return const Icon(Icons.local_parking, color: Colors.blue);
      case 'TOILET': return const Icon(Icons.wc, color: Colors.teal);
      case 'RESTAURANT': return const Icon(Icons.restaurant, color: Colors.orange);
      case 'BAR': return const Icon(Icons.local_bar, color: Colors.purple);
      case 'ADULT': return const Icon(Icons.nightlife, color: Colors.red); // Or explicit icon
      default: return const Icon(Icons.place, color: Colors.grey);
    }
  }
}
