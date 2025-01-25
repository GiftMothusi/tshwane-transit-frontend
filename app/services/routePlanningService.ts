// app/services/routePlanningService.ts

import axios from 'axios';
import { config } from '../config';

export interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

export interface RouteStop {
  name: string;
  coordinates: RouteCoordinates;
}

export interface RouteOption {
  route_id: number;
  route_number: string;
  name: string;
  total_distance: number;
  estimated_duration: number;
  fare: number;
  stops: RouteStop[];
  is_express: boolean;
}

class RoutePlanningService {
  static async planRoute(origin: RouteCoordinates, destination: RouteCoordinates): Promise<RouteOption[]> {
    try {
      console.log('Planning route with coordinates:', { origin, destination });
      
      // Ensure the API URL is correctly configured
      const apiUrl = `${config.api.baseURL}/v1/routes/plan`;
      console.log('Making request to:', apiUrl);
      
      const response = await axios.post(apiUrl, {
        origin,
        destination,
        radius: 2
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Route planning response:', response.data);
      
      if (!response.data || !response.data.routes) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      return response.data.routes;
    } catch (error: any) {
      console.error('Route planning error:', error.response || error);
      
      // Enhanced error handling with specific messages
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with an error
          throw new Error(error.response.data.message || 'Server error occurred');
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('No response from server. Please check your connection.');
        }
      }
      
      // General error
      throw new Error('Failed to plan route. Please try again.');
    }
  }
}

export default RoutePlanningService;